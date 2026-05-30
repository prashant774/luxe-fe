import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../src/context/CartContext";
import { WishlistProvider } from "../../src/context/WishlistContext";
import { UIProvider } from "../../src/context/UIContext";

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
