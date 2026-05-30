import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { CartProvider, CartContext } from "../../src/context/CartContext";

const P1 = { id: "p1", title: "Test Coat",  price: 200, images: ["/a.jpg"] };
const P2 = { id: "p2", title: "Test Knit",  price: 150, images: ["/b.jpg"] };

function Harness() {
  const { items, itemCount, subtotal, addItem, removeItem, updateQty, clearCart } =
    useContext(CartContext);
  return (
    <div>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="subtotal">{subtotal}</span>
      <span data-testid="len">{items.length}</span>
      <span data-testid="qty0">{items[0]?.qty ?? ""}</span>
      <button onClick={() => addItem(P1, "M", "Black")}>add-p1-M</button>
      <button onClick={() => addItem(P1, "M", "Black")}>add-p1-M-dup</button>
      <button onClick={() => addItem(P1, "L", "Black")}>add-p1-L</button>
      <button onClick={() => addItem(P2, "S", "Navy")}>add-p2-S</button>
      <button onClick={() => removeItem(0)}>remove-0</button>
      <button onClick={() => updateQty(0, 1)}>qty-plus</button>
      <button onClick={() => updateQty(0, -1)}>qty-minus</button>
      <button onClick={clearCart}>clear</button>
    </div>
  );
}

function renderCart() {
  render(<CartProvider><Harness /></CartProvider>);
}

describe("CartContext", () => {
  beforeEach(() => localStorage.clear());

  test("starts empty", () => {
    renderCart();
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("subtotal").textContent).toBe("0");
  });

  test("addItem adds a new item and updates count + subtotal", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("subtotal").textContent).toBe("200");
  });

  test("addItem increments qty for same id+size+color (dedup)", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    await userEvent.click(screen.getByText("add-p1-M-dup"));
    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(screen.getByTestId("len").textContent).toBe("1");
    expect(screen.getByTestId("qty0").textContent).toBe("2");
  });

  test("addItem creates a separate line for a different size", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    await userEvent.click(screen.getByText("add-p1-L"));
    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(screen.getByTestId("len").textContent).toBe("2");
  });

  test("removeItem removes the item at index 0", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    await userEvent.click(screen.getByText("remove-0"));
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("updateQty increases quantity", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    await userEvent.click(screen.getByText("qty-plus"));
    expect(screen.getByTestId("count").textContent).toBe("2");
  });

  test("updateQty auto-removes item when qty reaches 0", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    await userEvent.click(screen.getByText("qty-minus"));
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("len").textContent).toBe("0");
  });

  test("clearCart empties all items", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    await userEvent.click(screen.getByText("add-p2-S"));
    await userEvent.click(screen.getByText("clear"));
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("subtotal sums correctly across multiple line items", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    await userEvent.click(screen.getByText("add-p2-S"));
    expect(screen.getByTestId("subtotal").textContent).toBe("350");
  });

  test("persists items to localStorage on change", async () => {
    renderCart();
    await userEvent.click(screen.getByText("add-p1-M"));
    const stored = JSON.parse(localStorage.getItem("luxe_cart"));
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe("p1");
    expect(stored[0].size).toBe("M");
  });
});
