import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useCart } from "../hooks/useCart";
import { useUI } from "../hooks/useUI";
import { useWishlist } from "../hooks/useWishlist";
import styles from "../styles/CartScreen.module.css";

const NAV_ITEMS = [
  { label: "Shop All", href: "/products" },
  { label: "Outerwear", href: "/products" },
  { label: "Knitwear", href: "/products" },
  { label: "Trousers", href: "/products" },
];

const FOOTER_LINKS = [
  { label: "Gabardine Outerwear", href: "#" },
  { label: "Inner Cashmere Knitwear", href: "#" },
  { label: "Structured Blazers", href: "#" },
];

const FREE_SHIPPING_THRESHOLD = 500;

function CartScreen() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, removeItem, updateQty } = useCart();
  const { showToast, openWishlist } = useUI();
  const { itemCount: wishlistCount } = useWishlist();

  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : null;

  const handleRemove = (idx, title) => {
    removeItem(idx);
    showToast(`${title} removed from your bag.`, "info");
  };

  return (
    <div className={styles.page}>
      <Navbar items={NAV_ITEMS} brand="LUXE" />

      {/* Breadcrumb */}
      <div className={styles.breadcrumbWrap}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <a href="/" className={styles.breadcrumbLink} onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>Cart</span>
        </nav>
      </div>

      <div className={styles.wrap}>
        {itemCount === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
            <h2 className={styles.emptyTitle}>Your bag is empty</h2>
            <p className={styles.emptyDesc}>
              Explore the seasonal collection to find your next editorial piece.
            </p>
            <button
              type="button"
              className={styles.browseBtn}
              onClick={() => navigate("/products")}
            >
              BROWSE THE COLLECTION
            </button>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* ── Left: Items ── */}
            <div className={styles.itemsCol}>
              <h1 className={styles.pageTitle}>
                Your Editorial Bag <span className={styles.pageCount}>({itemCount})</span>
              </h1>

              {/* Shipping progress */}
              <div className={styles.shippingBar}>
                {remaining > 0 ? (
                  <p className={styles.shippingText}>
                    Spend <strong>${remaining.toFixed(2)}</strong> more to unlock free courier delivery
                  </p>
                ) : (
                  <p className={`${styles.shippingText} ${styles.shippingUnlocked}`}>
                    <i className="fa-solid fa-check" aria-hidden="true" /> Premium free delivery unlocked
                  </p>
                )}
                <div className={styles.shippingTrack}>
                  <div className={styles.shippingFill} style={{ width: `${shippingProgress}%` }} />
                </div>
              </div>

              {/* Item list */}
              <div className={styles.itemList}>
                {items.map((item, idx) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}-${idx}`} className={styles.itemRow}>
                    <img
                      src={item.product.images?.[0]}
                      alt={item.product.title}
                      className={styles.itemThumb}
                    />
                    <div className={styles.itemInfo}>
                      <div className={styles.itemTitleRow}>
                        <h3 className={styles.itemTitle}>{item.product.title}</h3>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleRemove(idx, item.product.title)}
                          aria-label={`Remove ${item.product.title}`}
                        >
                          <i className="fa-regular fa-trash-can" aria-hidden="true" />
                        </button>
                      </div>
                      <p className={styles.itemMeta}>
                        {item.product.brand} · Size {item.size} · {item.color}
                      </p>
                      <div className={styles.itemBottom}>
                        <div className={styles.qtyRow}>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => updateQty(idx, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={styles.qtyVal}>{item.qty}</span>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => updateQty(idx, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className={styles.itemPrice}>
                          ${(item.product.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={styles.continueLink}
                onClick={() => navigate("/products")}
              >
                <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                Continue Shopping
              </button>
            </div>

            {/* ── Right: Summary ── */}
            <div className={styles.summaryCol}>
              <div className={styles.summaryBox}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>

                <div className={styles.summaryLines}>
                  <div className={styles.summaryLine}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryLine}>
                    <span>Shipping</span>
                    <span className={shipping === 0 ? styles.freeShipping : ""}>
                      {shipping === 0 ? "FREE" : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className={styles.summaryLine}>
                    <span>Taxes</span>
                    <span className={styles.taxNote}>Calculated at checkout</span>
                  </div>
                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Estimated Total</span>
                  <span className={styles.totalVal}>${subtotal.toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  className={styles.checkoutBtn}
                  onClick={() => navigate("/checkout")}
                >
                  <i className="fa-solid fa-lock" aria-hidden="true" />
                  <span>PROCEED TO SECURE CHECKOUT</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer title="LUXE" links={FOOTER_LINKS} />

      {/* Mobile bottom nav */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
        <button type="button" className={styles.mobileNavBtn} onClick={() => navigate("/")}>
          <i className="fa-solid fa-house" aria-hidden="true" />
          <span>Home</span>
        </button>
        <button type="button" className={styles.mobileNavBtn} onClick={() => navigate("/products")}>
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <span>Catalog</span>
        </button>
        <button type="button" className={styles.mobileNavBtn} onClick={openWishlist}>
          <i className="fa-regular fa-heart" aria-hidden="true" />
          {wishlistCount > 0 && <span className={styles.navDot} />}
          <span>Wishlist</span>
        </button>
        <button type="button" className={`${styles.mobileNavBtn} ${styles.mobileNavBtnActive}`}>
          <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
          <span>Bag</span>
        </button>
      </nav>
    </div>
  );
}

export default CartScreen;
