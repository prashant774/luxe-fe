import { Outlet } from "react-router-dom";
import CartDrawer from "../CartDrawer/CartDrawer";
import WishlistDrawer from "../WishlistDrawer/WishlistDrawer";
import SearchModal from "../SearchModal/SearchModal";
import Toast from "../Toast/Toast";
import styles from "./AppLayout.module.css";

function AppLayout() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <Toast />
    </div>
  );
}

export default AppLayout;
