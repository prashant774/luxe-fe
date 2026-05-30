import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomeScreen from "../../screens/HomeScreen";
import { renderWithProviders } from "../../test/renderWithProviders";

// HomeScreen is imported directly (not lazy), so all renders are synchronous.
describe("HomeScreen", () => {
  beforeEach(() => localStorage.clear());

  test("renders the hero headline", () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByText(/Autumn Silhouette/i)).toBeInTheDocument();
  });

  test("renders exactly 3 featured product cards", () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  test("renders all 4 category labels in the strip", () => {
    renderWithProviders(<HomeScreen />);
    // Text appears in navbar, strip, and product cards — use getAllByText
    expect(screen.getAllByText("Outerwear").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Knitwear").length).toBeGreaterThan(0);
    expect(screen.getByText("Tailoring")).toBeInTheDocument(); // only in strip
    expect(screen.getAllByText("Trousers").length).toBeGreaterThan(0);
  });

  test("renders the EXPLORE THE COLLECTION CTA", () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByText("EXPLORE THE COLLECTION")).toBeInTheDocument();
  });

  test("renders the READ OUR SOURCING BLUEPRINT link", () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByText(/READ OUR SOURCING BLUEPRINT/i)).toBeInTheDocument();
  });

  test("wishlist toggle adds a product to wishlist and changes aria-label", async () => {
    renderWithProviders(<HomeScreen />);
    const addBtns = screen.getAllByLabelText(/Add to wishlist/i);
    expect(addBtns.length).toBe(3);
    await userEvent.click(addBtns[0]);
    // After toggle, that button should now say "Remove from wishlist"
    expect(screen.getAllByLabelText(/Remove from wishlist/i)).toHaveLength(1);
  });
});
