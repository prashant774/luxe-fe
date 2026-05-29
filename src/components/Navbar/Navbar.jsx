import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useUI } from "../../hooks/useUI";
import styles from "./Navbar.module.css";

function Navbar({ items = [], brand = "LUXE" }) {
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { openCart, openWishlist, openSearch } = useUI();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brandGroup}>
          <Link className={styles.brand} to="/">
            {brand}
            <span className={styles.dot}>.</span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {items.map((item) => (
              <Link key={item.label} className={styles.navLink} to={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Search"
            onClick={openSearch}
          >
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
            onClick={openWishlist}
          >
            <i className="fa-regular fa-heart" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className={styles.wishlistDot} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Shopping bag${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
            onClick={openCart}
          >
            <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
            {cartCount > 0 && (
              <span className={styles.bagCount} aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
