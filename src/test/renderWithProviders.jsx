import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { UIProvider } from "../context/UIContext";

/**
 * Wraps a component with all app providers + MemoryRouter.
 * @param {React.ReactElement} ui - component to render
 * @param {{ initialEntries?: string[] }} options
 */
export function renderWithProviders(ui, { initialEntries = ["/"] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <CartProvider>
        <WishlistProvider>
          <UIProvider>
            {ui}
          </UIProvider>
        </WishlistProvider>
      </CartProvider>
    </MemoryRouter>
  );
}
