import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const HomeScreen = lazy(() => import("../screens/HomeScreen"));
const ProductListingScreen = lazy(() => import("../screens/ProductListingScreen"));
const ProductDetailScreen = lazy(() => import("../screens/ProductDetailScreen"));
const CartScreen = lazy(() => import("../screens/CartScreen"));
const WishlistScreen = lazy(() => import("../screens/WishlistScreen"));
const CheckoutScreen = lazy(() => import("../screens/CheckoutScreen"));

function RouteLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "1.5rem", color: "#666" }} aria-label="Loading" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/products" element={<ProductListingScreen />} />
          <Route path="/products/:productId" element={<ProductDetailScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/wishlist" element={<WishlistScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
