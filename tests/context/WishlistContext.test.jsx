import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { WishlistProvider, WishlistContext } from "../../src/context/WishlistContext";

function Harness() {
  const { ids, itemCount, isWishlisted, toggleItem, removeItem, recentlyViewed, trackView } =
    useContext(WishlistContext);
  return (
    <div>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="ids">{JSON.stringify(ids)}</span>
      <span data-testid="recent">{JSON.stringify(recentlyViewed)}</span>
      <span data-testid="wishlisted-a">{String(isWishlisted("a"))}</span>
      <button onClick={() => toggleItem("a")}>toggle-a</button>
      <button onClick={() => toggleItem("b")}>toggle-b</button>
      <button onClick={() => removeItem("a")}>remove-a</button>
      <button onClick={() => trackView("p1")}>view-p1</button>
      <button onClick={() => trackView("p2")}>view-p2</button>
      <button onClick={() => trackView("p3")}>view-p3</button>
      <button onClick={() => trackView("p4")}>view-p4</button>
      <button onClick={() => trackView("p5")}>view-p5</button>
      <button onClick={() => trackView("p6")}>view-p6</button>
    </div>
  );
}

function renderWishlist() {
  render(<WishlistProvider><Harness /></WishlistProvider>);
}

describe("WishlistContext", () => {
  beforeEach(() => localStorage.clear());

  test("starts empty", () => {
    renderWishlist();
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("wishlisted-a").textContent).toBe("false");
  });

  test("toggleItem adds an item", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("toggle-a"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("wishlisted-a").textContent).toBe("true");
  });

  test("toggleItem removes item on second click", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("toggle-a"));
    await userEvent.click(screen.getByText("toggle-a"));
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("wishlisted-a").textContent).toBe("false");
  });

  test("removeItem removes a specific item by id", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("toggle-a"));
    await userEvent.click(screen.getByText("toggle-b"));
    await userEvent.click(screen.getByText("remove-a"));
    const ids = JSON.parse(screen.getByTestId("ids").textContent);
    expect(ids).toEqual(["b"]);
  });

  test("trackView records views in most-recent-first order", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("view-p1"));
    await userEvent.click(screen.getByText("view-p2"));
    const recent = JSON.parse(screen.getByTestId("recent").textContent);
    expect(recent[0]).toBe("p2");
    expect(recent[1]).toBe("p1");
  });

  test("trackView deduplicates and moves existing entry to front", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("view-p1"));
    await userEvent.click(screen.getByText("view-p2"));
    await userEvent.click(screen.getByText("view-p1"));
    const recent = JSON.parse(screen.getByTestId("recent").textContent);
    expect(recent[0]).toBe("p1");
    expect(recent).toHaveLength(2);
  });

  test("trackView caps at 5 items, dropping the oldest", async () => {
    renderWishlist();
    for (const btn of ["view-p1","view-p2","view-p3","view-p4","view-p5","view-p6"]) {
      await userEvent.click(screen.getByText(btn));
    }
    const recent = JSON.parse(screen.getByTestId("recent").textContent);
    expect(recent).toHaveLength(5);
    expect(recent[0]).toBe("p6");
    expect(recent).not.toContain("p1");
  });

  test("persists wishlist ids to localStorage", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("toggle-a"));
    const stored = JSON.parse(localStorage.getItem("luxe_wishlist"));
    expect(stored).toContain("a");
  });
});
