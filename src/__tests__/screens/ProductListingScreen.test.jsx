import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductListingScreen from "../../screens/ProductListingScreen";
import { renderWithProviders } from "../../test/renderWithProviders";

// PLP has a 1-second fake loading delay before showing products.
// All tests that need loaded products must use waitFor with an adequate timeout.

function renderPLP(search = "") {
  return renderWithProviders(<ProductListingScreen />, {
    initialEntries: [`/products${search}`],
  });
}

describe("ProductListingScreen", () => {
  beforeEach(() => localStorage.clear());

  test("shows skeleton loader elements during the initial 1-second load", () => {
    renderPLP();
    // SkeletonCards are aria-hidden; FA icons in Navbar are also aria-hidden.
    // We check for the "—" placeholder in the product count which shows while loading.
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  test("shows product count and grid after loading completes", async () => {
    renderPLP();
    await waitFor(
      () => expect(screen.getByText(/\d+ pieces/i)).toBeInTheDocument(),
      { timeout: 2500 }
    );
  });

  test("sort dropdown contains all 5 options including Featured Collection", async () => {
    renderPLP();
    const select = screen.getByRole("combobox");
    const labels = Array.from(select.querySelectorAll("option")).map(o => o.textContent);
    expect(labels).toContain("Featured Collection");
    expect(labels).toContain("Newest First");
    expect(labels).toContain("Price: Low to High");
    expect(labels).toContain("Price: High to Low");
    expect(labels).toContain("Highest Rated");
  });

  test("pre-selects Outerwear category filter from URL ?category param", async () => {
    renderPLP("?category=Outerwear");
    await waitFor(
      () => {
        const checkboxes = screen.getAllByRole("checkbox");
        const outerwearCb = checkboxes.find(
          cb => cb.closest("label")?.textContent?.includes("Outerwear")
        );
        expect(outerwearCb).toBeChecked();
      },
      { timeout: 2500 }
    );
  });

  test("shows no-results empty state when search query matches nothing", async () => {
    renderPLP("?q=xyzzy-absolutely-no-match");
    await waitFor(
      () => expect(screen.getByText(/No pieces found/i)).toBeInTheDocument(),
      { timeout: 2500 }
    );
  });

  test("Clear Filters button appears when filters are active", async () => {
    renderPLP();
    await waitFor(() => expect(screen.getByText(/\d+ pieces/i)).toBeInTheDocument(), { timeout: 2500 });
    // Click the Outerwear category checkbox to activate a filter
    const checkboxes = screen.getAllByRole("checkbox");
    const outerwearCb = checkboxes.find(
      cb => cb.closest("label")?.textContent?.includes("Outerwear")
    );
    await userEvent.click(outerwearCb);
    // "Clear All" appears in both desktop sidebar and mobile filter drawer
    expect(screen.getAllByText("Clear All").length).toBeGreaterThan(0);
  });
});
