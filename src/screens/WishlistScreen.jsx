import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useUI } from "../hooks/useUI";
import { productIndex } from "../utils/data";
import styles from "../styles/WishlistScreen.module.css";
import { NAV_ITEMS, FOOTER_LINKS } from "../utils/constants";

function WishlistScreen() {
  const navigate = useNavigate();
  const { ids, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useUI();
  const [pulsingId, setPulsingId] = useState(null);

  const wishlistProducts = ids.map((id) => productIndex[id]).filter(Boolean);

  const handleMoveToBag = (product) => {
    const size = product.sizes?.[1] ?? product.sizes?.[0] ?? "One Size";
    const color = product.colors?.[0]?.name ?? "";
    addItem(product, size, color);
    removeItem(product.id);
    showToast(`${product.title} moved to your bag.`, "success");
    navigate("/cart");
  };

  const handleRemove = (product) => {
    setPulsingId(product.id);
    setTimeout(() => {
      removeItem(product.id);
      showToast(`${product.title} removed from wishlist.`, "info");
      setPulsingId(null);
    }, 350);
  };

  return (
    <div className={styles.page}>
      <Navbar items={NAV_ITEMS} brand="LUXE" />

      {/* Breadcrumb */}
      <div className={styles.breadcrumbWrap}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <a href="/" className={styles.breadcrumbLink} onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>Wishlist</span>
        </nav>
      </div>

      {/* Page header */}
      <div className={styles.pageHeader}>
        <span className={styles.eyebrow}>Your Curation</span>
        <h1 className={styles.pageTitle}>Editorial Wishlist</h1>
        {wishlistProducts.length > 0 && (
          <p className={styles.pageCount}>{wishlistProducts.length} piece{wishlistProducts.length !== 1 ? "s" : ""} saved</p>
        )}
      </div>

      <div className={styles.wrap}>
        {wishlistProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-regular fa-heart" aria-hidden="true" />
            <h2 className={styles.emptyTitle}>No saved items yet</h2>
            <p className={styles.emptyDesc}>
              Mark favourite items across the catalog to populate your wardrobe blueprint.
            </p>
            <button
              type="button"
              className={styles.browseBtn}
              onClick={() => navigate("/products")}
            >
              EXPLORE THE COLLECTION
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlistProducts.map((product) => (
              <article key={product.id} className={styles.card}>
                <div
                  className={styles.imageWrap}
                  onClick={() => navigate(`/products/${product.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/products/${product.id}`)}
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className={styles.imagePrimary}
                  />
                  <img
                    src={product.images?.[1] ?? product.images?.[0]}
                    alt=""
                    aria-hidden="true"
                    className={styles.imageSecondary}
                  />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={(e) => { e.stopPropagation(); handleRemove(product); }}
                    aria-label={`Remove ${product.title} from wishlist`}
                  >
                    <i className={`fa-solid fa-heart${pulsingId === product.id ? ` ${styles.heartPulse}` : ""}`} aria-hidden="true" />
                  </button>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{product.title}</h3>
                    <p className={styles.cardCategory}>{product.category}</p>
                  </div>
                  <span className={styles.cardPrice}>${product.price.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  className={styles.moveBtn}
                  onClick={() => handleMoveToBag(product)}
                >
                  MOVE TO BAG ({product.sizes?.[1] ?? product.sizes?.[0] ?? "One Size"})
                </button>
              </article>
            ))}
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
        <button type="button" className={`${styles.mobileNavBtn} ${styles.mobileNavBtnActive}`}>
          <i className="fa-solid fa-heart" aria-hidden="true" />
          <span>Wishlist</span>
        </button>
        <button type="button" className={styles.mobileNavBtn} onClick={() => navigate("/cart")}>
          <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
          <span>Bag</span>
        </button>
      </nav>
    </div>
  );
}

export default WishlistScreen;
