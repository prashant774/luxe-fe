import { screen, waitFor } from "@testing-library/react";
import App from "../../App";
import { renderWithProviders } from "../../test/renderWithProviders";

// App uses React.lazy in AppRoutes — Suspense resolves async, so we must waitFor.
describe("App — integration shell", () => {
  beforeEach(() => localStorage.clear());

  it("renders the primary navigation", async () => {
    renderWithProviders(<App />);
    await waitFor(() =>
      expect(screen.getByRole("navigation", { name: /primary navigation/i })).toBeInTheDocument()
    );
  });

  it("renders the homepage hero headline on the root route", async () => {
    renderWithProviders(<App />);
    await waitFor(() =>
      expect(screen.getByText(/Autumn Silhouette/i)).toBeInTheDocument()
    );
  });

  it("renders the LUXE brand name in the navbar", async () => {
    renderWithProviders(<App />);
    await waitFor(() =>
      expect(screen.getAllByText(/LUXE/i).length).toBeGreaterThan(0)
    );
  });
});
