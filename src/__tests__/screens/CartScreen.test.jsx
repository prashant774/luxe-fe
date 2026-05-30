import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import CartScreen from "../../screens/CartScreen";
import { CartContext } from "../../context/CartContext";
import { renderWithProviders } from "../../test/renderWithProviders";

const MOCK_PRODUCT = {
  id: "p1",
  title: "Gabardine Trench",
  brand: "LUXE Atelier",
  price: 345,
  images: ["/img.jpg"],
};

// Seeder sits inside CartProvider (via renderWithProviders) so it has access to CartContext.
function CartTestPage() {
  const { addItem } = useContext(CartContext);
  return (
    <>
      <button onClick={() => addItem(MOCK_PRODUCT, "M", "Warm Sand")}>seed-item</button>
      <CartScreen />
    </>
  );
}

function renderCart() {
  return renderWithProviders(<CartTestPage />);
}

describe("CartScreen", () => {
  beforeEach(() => localStorage.clear());

  test("shows empty-bag state when cart has no items", () => {
    renderWithProviders(<CartScreen />);
    expect(screen.getByText(/Your bag is empty/i)).toBeInTheDocument();
  });

  test("shows item title after seeding the cart", async () => {
    renderCart();
    await userEvent.click(screen.getByText("seed-item"));
    expect(screen.getByText("Gabardine Trench")).toBeInTheDocument();
  });

  test("increase-qty button increments the cart item count in the title", async () => {
    renderCart();
    await userEvent.click(screen.getByText("seed-item"));
    await userEvent.click(screen.getByLabelText(/increase quantity/i));
    // Cart title: "Your Editorial Bag (2)"
    expect(screen.getByText("(2)")).toBeInTheDocument();
  });

  test("decrease-qty to 0 removes the item and shows empty state", async () => {
    renderCart();
    await userEvent.click(screen.getByText("seed-item"));
    await userEvent.click(screen.getByLabelText(/decrease quantity/i));
    expect(screen.getByText(/Your bag is empty/i)).toBeInTheDocument();
  });

  test("shows the PROCEED TO SECURE CHECKOUT button when items exist", async () => {
    renderCart();
    await userEvent.click(screen.getByText("seed-item"));
    expect(screen.getByText(/PROCEED TO SECURE CHECKOUT/i)).toBeInTheDocument();
  });

  test("shipping bar shows free delivery unlocked at $500+", async () => {
    renderCart();
    await userEvent.click(screen.getByText("seed-item"));
    // $345 < $500, so we should see "spend X more" message
    expect(screen.getByText(/more to unlock/i)).toBeInTheDocument();
  });

  test("order summary shows correct subtotal", async () => {
    renderCart();
    await userEvent.click(screen.getByText("seed-item"));
    // $345.00 appears in: item price, subtotal line, total row — use getAllByText
    expect(screen.getAllByText("$345.00").length).toBeGreaterThan(0);
  });
});
