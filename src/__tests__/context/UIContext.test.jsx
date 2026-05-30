import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { UIProvider, UIContext } from "../../context/UIContext";

function Harness() {
  const {
    cartOpen, openCart, closeCart,
    wishlistOpen, openWishlist,
    searchOpen, openSearch, closeSearch,
    toast, showToast,
  } = useContext(UIContext);
  return (
    <div>
      <span data-testid="cart-open">{String(cartOpen)}</span>
      <span data-testid="wishlist-open">{String(wishlistOpen)}</span>
      <span data-testid="search-open">{String(searchOpen)}</span>
      <span data-testid="toast-visible">{String(toast.visible)}</span>
      <span data-testid="toast-msg">{toast.message}</span>
      <button onClick={openCart}>open-cart</button>
      <button onClick={closeCart}>close-cart</button>
      <button onClick={openWishlist}>open-wishlist</button>
      <button onClick={openSearch}>open-search</button>
      <button onClick={closeSearch}>close-search</button>
      <button onClick={() => showToast("Hello!")}>show-toast</button>
      <button onClick={() => showToast("Second!")}>show-toast-2</button>
    </div>
  );
}

function renderUI() {
  render(<UIProvider><Harness /></UIProvider>);
}

describe("UIContext", () => {
  test("cart drawer opens and closes", async () => {
    renderUI();
    expect(screen.getByTestId("cart-open").textContent).toBe("false");
    await userEvent.click(screen.getByText("open-cart"));
    expect(screen.getByTestId("cart-open").textContent).toBe("true");
    await userEvent.click(screen.getByText("close-cart"));
    expect(screen.getByTestId("cart-open").textContent).toBe("false");
  });

  test("wishlist drawer opens", async () => {
    renderUI();
    await userEvent.click(screen.getByText("open-wishlist"));
    expect(screen.getByTestId("wishlist-open").textContent).toBe("true");
  });

  test("search modal opens and closes", async () => {
    renderUI();
    await userEvent.click(screen.getByText("open-search"));
    expect(screen.getByTestId("search-open").textContent).toBe("true");
    await userEvent.click(screen.getByText("close-search"));
    expect(screen.getByTestId("search-open").textContent).toBe("false");
  });

  test("showToast makes toast visible with the correct message", async () => {
    renderUI();
    expect(screen.getByTestId("toast-visible").textContent).toBe("false");
    await userEvent.click(screen.getByText("show-toast"));
    expect(screen.getByTestId("toast-visible").textContent).toBe("true");
    expect(screen.getByTestId("toast-msg").textContent).toBe("Hello!");
  });

  test("second showToast replaces the first message and stays visible", async () => {
    renderUI();
    await userEvent.click(screen.getByText("show-toast"));
    await userEvent.click(screen.getByText("show-toast-2"));
    expect(screen.getByTestId("toast-msg").textContent).toBe("Second!");
    expect(screen.getByTestId("toast-visible").textContent).toBe("true");
  });
});
