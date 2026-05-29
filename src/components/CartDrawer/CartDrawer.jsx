import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useUI } from "../../hooks/useUI";
import styles from "./CartDrawer.module.css";

const FREE_SHIPPING_THRESHOLD = 500;

function CartDrawer() {
  const { items, subtotal, removeItem, updateQty } = useCart();
  const { cartOpen, closeCart } = useUI();
  const navigate = useNavigate();

  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleBrowse = () => {
    closeCart();
    navigate("/products");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${cartOpen ? styles.backdropVisible : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`${styles.panel} ${cartOpen ? styles.panelOpen : ""}`}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            Your Editorial Bag
            <span className={styles.count}> ({items.length})</span>
          </h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label="Close cart"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
            <p className={styles.emptyTitle}>Your bag is empty</p>
            <p className={styles.emptyDesc}>
              Explore seasonal drops to build your editorial wardrobe.
            </p>
            <button
              type="button"
              className={styles.browseBtn}
              onClick={handleBrowse}
            >
              BROWSE THE CATALOG
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className={styles.shippingBar}>
              {remaining > 0 ? (
                <p className={styles.shippingText}>
                  Spend <strong>${remaining.toFixed(2)}</strong> more for free courier delivery
                </p>
              ) : (
                <p className={`${styles.shippingText} ${styles.shippingUnlocked}`}>
                  <i className="fa-solid fa-check" aria-hidden="true" /> Premium free delivery unlocked
                </p>
              )}
              <div className={styles.shippingTrack}>
                <div
                  className={styles.shippingFill}
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className={styles.itemsList}>
              {items.map((item, idx) => (
                <div key={`${item.product.id}-${item.size}-${item.color}-${idx}`} className={styles.itemRow}>
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.title}
                    className={styles.itemThumb}
                  />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitleRow}>
                      <span className={styles.itemTitle}>{item.product.title}</span>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => removeItem(idx)}
                        aria-label={`Remove ${item.product.title}`}
                      >
                        <i className="fa-regular fa-trash-can" aria-hidden="true" />
                      </button>
                    </div>
                    <p className={styles.itemMeta}>
                      Size {item.size} · {item.color}
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

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.subtotalRow}>
                <span className={styles.subtotalLabel}>Estimated Subtotal</span>
                <span className={styles.subtotalVal}>${subtotal.toFixed(2)}</span>
              </div>
              <p className={styles.taxNote}>Taxes calculated at shipment point.</p>
              <button
                type="button"
                className={styles.checkoutBtn}
                onClick={handleCheckout}
              >
                <i className="fa-solid fa-lock" aria-hidden="true" />
                <span>PROCEED TO SECURE CHECKOUT</span>
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
