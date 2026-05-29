import { Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomeScreen from "../screens/HomeScreen";
import ProductListingScreen from "../screens/ProductListingScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import WishlistScreen from "../screens/WishlistScreen";
import CheckoutScreen from "../screens/CheckoutScreen";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/products" element={<ProductListingScreen />} />
        <Route path="/products/:productId" element={<ProductDetailScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/wishlist" element={<WishlistScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
