import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { useUI } from "../../hooks/useUI";
import { productIndex } from "../../utils/data";
import styles from "./WishlistDrawer.module.css";

function WishlistDrawer() {
  const { ids, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { wishlistOpen, closeWishlist, showToast } = useUI();
  const navigate = useNavigate();

  const wishlistProducts = ids.map((id) => productIndex[id]).filter(Boolean);

  const handleMoveToBag = (product) => {
    const size = product.sizes?.[1] ?? product.sizes?.[0] ?? "One Size";
    const color = product.colors?.[0]?.name ?? "";
    addItem(product, size, color);
    removeItem(product.id);
    closeWishlist();
    showToast(`${product.title} moved to your bag.`, "success");
    navigate("/cart");
  };

  const handleDelete = (product) => {
    removeItem(product.id);
    showToast(`${product.title} removed from wishlist.`, "info");
  };

  const handleBrowse = () => {
    closeWishlist();
    navigate("/products");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${wishlistOpen ? styles.backdropVisible : ""}`}
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`${styles.panel} ${wishlistOpen ? styles.panelOpen : ""}`}
        aria-label="Wishlist"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            Your Wishlist
            <span className={styles.count}> ({ids.length})</span>
          </h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeWishlist}
            aria-label="Close wishlist"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-regular fa-heart" aria-hidden="true" />
            <p className={styles.emptyTitle}>No saved items</p>
            <p className={styles.emptyDesc}>
              Mark favourite items in the catalog to populate your wardrobe blueprint.
            </p>
            <button type="button" className={styles.browseBtn} onClick={handleBrowse}>
              EXPLORE THE CATALOG
            </button>
          </div>
        ) : (
          <div className={styles.itemsList}>
            {wishlistProducts.map((product) => (
              <div key={product.id} className={styles.itemRow}>
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className={styles.itemThumb}
                />
                <div className={styles.itemInfo}>
                  <div className={styles.itemTitleRow}>
                    <span className={styles.itemTitle}>{product.title}</span>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(product)}
                      aria-label={`Remove ${product.title} from wishlist`}
                    >
                      <i className="fa-regular fa-trash-can" aria-hidden="true" />
                    </button>
                  </div>
                  <p className={styles.itemPrice}>${product.price.toFixed(2)}</p>
                  <button
                    type="button"
                    className={styles.moveBtn}
                    onClick={() => handleMoveToBag(product)}
                  >
                    MOVE TO BAG ({product.sizes?.[1] ?? product.sizes?.[0] ?? "One Size"})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}

export default WishlistDrawer;
