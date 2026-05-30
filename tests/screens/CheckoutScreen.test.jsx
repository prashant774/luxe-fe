import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import CheckoutScreen from "../../src/screens/CheckoutScreen";
import { CartContext } from "../../src/context/CartContext";
import { renderWithProviders } from "../helpers/renderWithProviders";

const MOCK_PRODUCT = {
  id: "p1",
  title: "Gabardine Trench",
  brand: "LUXE Atelier",
  price: 345,
  images: ["/img.jpg"],
  sizes: ["S", "M", "L"],
  colors: [{ name: "Warm Sand", hex: "#D7C49E" }],
};

// Use delay:null to skip artificial keystroke delays — prevents timeout in full-suite runs
// where per-keystroke React change events on a 77-char fill can exceed 5 s under CPU pressure.
const user = userEvent.setup({ delay: null });

function CheckoutTestPage() {
  const { addItem } = useContext(CartContext);
  return (
    <>
      <button onClick={() => addItem(MOCK_PRODUCT, "M", "Warm Sand")}>seed-item</button>
      <CheckoutScreen />
    </>
  );
}

function renderCheckout() {
  return renderWithProviders(<CheckoutTestPage />);
}

async function fillAllFields() {
  // Use exact strings to avoid matching Footer newsletter input (aria-label="Email address for newsletter")
  await user.type(screen.getByLabelText("Email Address"), "test@example.com");
  await user.type(screen.getByLabelText("First Name"), "Jane");
  await user.type(screen.getByLabelText("Last Name"), "Doe");
  await user.type(screen.getByLabelText("Street Address"), "123 Main St");
  await user.type(screen.getByLabelText("City"), "London");
  await user.type(screen.getByLabelText(/ZIP \/ Postal Code/i), "W1A1AA");
  await user.type(screen.getByLabelText("Cardholder Name"), "Jane Doe");
  await user.type(screen.getByLabelText("Credit Card Number"), "4111111111111111");
  await user.type(screen.getByLabelText("Expiry Date"), "1225");
  await user.type(screen.getByLabelText("CVV"), "123");
}

describe("CheckoutScreen", () => {
  beforeEach(() => localStorage.clear());

  test("renders the three form section headings", () => {
    renderWithProviders(<CheckoutScreen />);
    expect(screen.getByText(/Contact Specifications/i)).toBeInTheDocument();
    expect(screen.getByText(/Courier Destination Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Parameters/i)).toBeInTheDocument();
  });

  test("PLACE SECURE ORDER submit button is present", () => {
    renderWithProviders(<CheckoutScreen />);
    expect(screen.getByRole("button", { name: /PLACE SECURE ORDER/i })).toBeInTheDocument();
  });

  test("shows empty bag note in the order summary when cart is empty", () => {
    renderWithProviders(<CheckoutScreen />);
    expect(screen.getByText(/Your bag is empty/i)).toBeInTheDocument();
  });

  test("shows the 'Checkout Items' heading when cart has items", async () => {
    renderCheckout();
    await user.click(screen.getByText("seed-item"));
    expect(screen.getByText(/Checkout Items/i)).toBeInTheDocument();
  });

  test("shows item title in the order summary after seeding cart", async () => {
    renderCheckout();
    await user.click(screen.getByText("seed-item"));
    expect(screen.getByText("Gabardine Trench")).toBeInTheDocument();
  });

  test("shows Grand Total matching the item price", async () => {
    renderCheckout();
    await user.click(screen.getByText("seed-item"));
    expect(screen.getAllByText("$345.00").length).toBeGreaterThan(0);
  });

  test("cardNumber input auto-formats digits with spaces after 4 chars", async () => {
    renderWithProviders(<CheckoutScreen />);
    const cardInput = screen.getByLabelText("Credit Card Number");
    await user.type(cardInput, "4111111111111111");
    expect(cardInput.value).toMatch(/^\d{4} \d{4} \d{4} \d{4}$/);
  });

  test("expiry input auto-formats as MM / YY", async () => {
    renderWithProviders(<CheckoutScreen />);
    const expiryInput = screen.getByLabelText("Expiry Date");
    await user.type(expiryInput, "1225");
    expect(expiryInput.value).toMatch(/^12 \/ 25$/);
  });

  test("CVV input strips non-numeric characters", async () => {
    renderWithProviders(<CheckoutScreen />);
    const cvvInput = screen.getByLabelText("CVV");
    await user.type(cvvInput, "12a3");
    expect(cvvInput.value).toBe("123");
  });

  test("submitting a filled form transitions to the success screen", async () => {
    renderCheckout();
    await user.click(screen.getByText("seed-item"));
    await fillAllFields();
    await user.click(screen.getByRole("button", { name: /PLACE SECURE ORDER/i }));
    expect(screen.getByText(/Secure order executed/i)).toBeInTheDocument();
  });

  test("success screen shows RETURN TO MAIN HOMEPAGE button", async () => {
    renderCheckout();
    await user.click(screen.getByText("seed-item"));
    await fillAllFields();
    await user.click(screen.getByRole("button", { name: /PLACE SECURE ORDER/i }));
    expect(screen.getByRole("button", { name: /RETURN TO MAIN HOMEPAGE/i })).toBeInTheDocument();
  });

  test("success screen displays the submitted email in the confirmation message", async () => {
    renderCheckout();
    await user.click(screen.getByText("seed-item"));
    await fillAllFields();
    await user.click(screen.getByRole("button", { name: /PLACE SECURE ORDER/i }));
    expect(screen.getByText(/test@example\.com/i)).toBeInTheDocument();
  });

  test("success screen shows a generated order ref code (LX-XXXXXX-XX format)", async () => {
    renderCheckout();
    await user.click(screen.getByText("seed-item"));
    await fillAllFields();
    await user.click(screen.getByRole("button", { name: /PLACE SECURE ORDER/i }));
    expect(screen.getByText(/LX-\d{6}-[A-Z]{2}/)).toBeInTheDocument();
  });
});
