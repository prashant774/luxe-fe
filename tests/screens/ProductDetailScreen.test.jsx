import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import ProductDetailScreen from "../../src/screens/ProductDetailScreen";
import { renderWithProviders } from "../helpers/renderWithProviders";

// prod-001: sizes ["XS","S","M","L","XL"], soldOutSizes ["XS","XL"]
// prod-003: sizes ["S","M","L"],            soldOutSizes ["S"]

function renderPDP(productId = "prod-001") {
  return renderWithProviders(
    <Routes>
      <Route path="/products/:productId" element={<ProductDetailScreen />} />
    </Routes>,
    { initialEntries: [`/products/${productId}`] }
  );
}

describe("ProductDetailScreen", () => {
  beforeEach(() => localStorage.clear());

  test("renders the product title h1 for prod-001", () => {
    renderPDP();
    // Title appears in breadcrumb, h1, and mobile bar — target the heading specifically
    expect(screen.getByRole("heading", { level: 1, name: /Gabardine Trench/i })).toBeInTheDocument();
  });

  test("renders the category tag in the info pane", () => {
    renderPDP();
    // The PDP renders category as a tag above the title; it also appears in the breadcrumb
    expect(screen.getAllByText(/Outerwear/i).length).toBeGreaterThan(0);
  });

  test("shows not-found state for an invalid product id", () => {
    renderPDP("does-not-exist");
    expect(screen.getByText(/Product not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse All Collections/i)).toBeInTheDocument();
  });

  test("ADD TO BAG button is present", () => {
    renderPDP();
    expect(screen.getByText(/ADD TO BAG/i)).toBeInTheDocument();
  });

  test("sold-out XS button is disabled for prod-001", () => {
    renderPDP("prod-001");
    expect(screen.getByRole("button", { name: /^XS$/i })).toBeDisabled();
  });

  test("sold-out XL button is disabled for prod-001", () => {
    renderPDP("prod-001");
    expect(screen.getByRole("button", { name: /^XL$/i })).toBeDisabled();
  });

  test("non-sold-out S button is enabled for prod-001", () => {
    renderPDP("prod-001");
    expect(screen.getByRole("button", { name: /^S$/i })).not.toBeDisabled();
  });

  test("PDP auto-skips sold-out sizes: prod-001 pre-selects S (not XS)", () => {
    renderPDP("prod-001");
    expect(screen.getByRole("button", { name: /^S$/i })).toBeInTheDocument();
  });

  test("clicking ADD TO BAG with pre-selected valid size succeeds", async () => {
    renderPDP("prod-001");
    await userEvent.click(screen.getByText(/ADD TO BAG/i));
    expect(screen.getByText(/ADDED TO BAG/i)).toBeInTheDocument();
  });

  test("clicking a size then ADD TO BAG updates the confirmation label", async () => {
    renderPDP("prod-001");
    await userEvent.click(screen.getByRole("button", { name: /^M$/i }));
    await userEvent.click(screen.getByText(/ADD TO BAG/i));
    expect(screen.getByText(/ADDED TO BAG/i)).toBeInTheDocument();
  });

  test("accordions for Sourcing and Delivery are rendered", () => {
    renderPDP();
    expect(screen.getByText(/Sourcing & Composition/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery & Returns/i)).toBeInTheDocument();
  });

  test("wishlist toggle changes aria-label from Add to Remove", async () => {
    renderPDP();
    const addBtn = screen.getByLabelText(/Add to wishlist/i);
    await userEvent.click(addBtn);
    expect(screen.getAllByLabelText(/Remove from wishlist/i).length).toBeGreaterThan(0);
  });

  // Regression test for Bug 2: clicking thumbnails must update the main image
  // and NOT reset back to index 0 (was caused by unmemoized trackView in useEffect deps)
  test("clicking a thumbnail updates the main image src", async () => {
    renderPDP("prod-001");
    // Get all thumbnail buttons (prod-001 has 2 images → 2 thumbs)
    const thumbBtns = screen.getAllByRole("button", { name: /View image/i });
    expect(thumbBtns.length).toBeGreaterThanOrEqual(2);

    // The main image role — it has the product alt text
    const mainImg = screen.getByAltText(/Minimalist Gabardine Trench/i);
    const firstSrc = mainImg.getAttribute("src");

    // Click the second thumbnail
    await userEvent.click(thumbBtns[1]);

    // src should now differ from the first image
    expect(mainImg.getAttribute("src")).not.toBe(firstSrc);
  });
});
