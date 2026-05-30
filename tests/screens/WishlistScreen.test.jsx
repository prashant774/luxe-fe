import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import WishlistScreen from "../../src/screens/WishlistScreen";
import { WishlistContext } from "../../src/context/WishlistContext";
import { renderWithProviders } from "../helpers/renderWithProviders";

// prod-001: "Minimalist Gabardine Trench", price $345, sizes ["XS","S","M","L","XL"]
// prod-009: "Mock-Neck Cashmere Knit",     price $185, sizes ["XS","S","M","L","XL"], soldOut ["XS"]

function WishlistTestPage() {
  const { toggleItem } = useContext(WishlistContext);
  return (
    <>
      <button onClick={() => toggleItem("prod-001")}>seed-prod-001</button>
      <button onClick={() => toggleItem("prod-009")}>seed-prod-009</button>
      <WishlistScreen />
    </>
  );
}

function renderWishlist() {
  return renderWithProviders(<WishlistTestPage />);
}

describe("WishlistScreen", () => {
  beforeEach(() => localStorage.clear());

  test("renders the Editorial Wishlist h1", () => {
    renderWithProviders(<WishlistScreen />);
    expect(screen.getByRole("heading", { level: 1, name: /Editorial Wishlist/i })).toBeInTheDocument();
  });

  test("shows empty state when wishlist has no items", () => {
    renderWithProviders(<WishlistScreen />);
    expect(screen.getByText(/No saved items yet/i)).toBeInTheDocument();
  });

  test("EXPLORE THE COLLECTION button is present in empty state", () => {
    renderWithProviders(<WishlistScreen />);
    expect(screen.getByRole("button", { name: /EXPLORE THE COLLECTION/i })).toBeInTheDocument();
  });

  test("shows item title when a product is wishlisted", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    expect(screen.getByText(/Minimalist Gabardine Trench/i)).toBeInTheDocument();
  });

  test("shows 1 piece saved count in header for one item", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    expect(screen.getByText(/1 piece saved/i)).toBeInTheDocument();
  });

  test("shows 2 pieces saved count for two items", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    await userEvent.click(screen.getByText("seed-prod-009"));
    expect(screen.getByText(/2 pieces saved/i)).toBeInTheDocument();
  });

  test("renders MOVE TO BAG button for each wishlisted item", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    expect(screen.getByRole("button", { name: /MOVE TO BAG/i })).toBeInTheDocument();
  });

  test("MOVE TO BAG label includes the default size for the product", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    // prod-001 sizes[1] = "S"
    expect(screen.getByText(/MOVE TO BAG \(S\)/i)).toBeInTheDocument();
  });

  test("remove button aria-label includes the product title", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    expect(
      screen.getByLabelText(/Remove Minimalist Gabardine Trench from wishlist/i)
    ).toBeInTheDocument();
  });

  test("both products appear when two items are wishlisted", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    await userEvent.click(screen.getByText("seed-prod-009"));
    expect(screen.getByText(/Minimalist Gabardine Trench/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock-Neck Cashmere Knit/i)).toBeInTheDocument();
  });

  test("shows item price formatted as currency", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    expect(screen.getByText("$345.00")).toBeInTheDocument();
  });

  test("empty state re-appears after toggling item back off", async () => {
    renderWishlist();
    await userEvent.click(screen.getByText("seed-prod-001"));
    // Toggle same item off
    await userEvent.click(screen.getByText("seed-prod-001"));
    expect(screen.getByText(/No saved items yet/i)).toBeInTheDocument();
  });
});
