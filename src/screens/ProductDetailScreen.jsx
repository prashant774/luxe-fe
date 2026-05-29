import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SizingAssistantModal from "../components/SizingAssistantModal/SizingAssistantModal";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useUI } from "../hooks/useUI";
import styles from "../styles/ProductDetailScreen.module.css";
import { productIndex } from "../utils/data";

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

const COLOR_MAP = {
  Ash: "#B2BEB5",       Black: "#1A1A1A",    Blush: "#DE5D83",
  Blue: "#3B82F6",      Bronze: "#CD7F32",   Camel: "#C19A6B",
  Carbon: "#2D2D2D",    Charcoal: "#36454F", Chocolate: "#7B3F00",
  Clay: "#B66A50",      Coal: "#3D3C3A",     Copper: "#B87333",
  Cream: "#FFF8E7",     Gold: "#D4AF37",     Graphite: "#383838",
  Indigo: "#3730A3",    Ink: "#1E2235",      Ivory: "#FFFFF0",
  Khaki: "#C3B091",     Midnight: "#1A1A3E", Mink: "#9E7B7B",
  Mist: "#C4D4DA",      Moss: "#8A9A5B",     Natural: "#F5DEB3",
  Navy: "#001F5B",      Obsidian: "#2D2D2D", Olive: "#6B7645",
  Onyx: "#353839",      Pearl: "#EAE0C8",    Pine: "#01796F",
  Plum: "#8E4585",      Sand: "#C4A882",     Sage: "#8B9467",
  Silver: "#C0C0C0",    Steel: "#708090",    Stone: "#928E85",
  Tan: "#D2B48C",       Taupe: "#8B7D6B",    Washed: "#A9B7C6",
  White: "#F5F5F5",
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className={styles.stars}>
      {Array.from({ length: full }, (_, i) => (
        <i key={`f${i}`} className="fa-solid fa-star" />
      ))}
      {half > 0 && <i className="fa-solid fa-star-half-stroke" />}
      {Array.from({ length: empty }, (_, i) => (
        <i key={`e${i}`} className="fa-regular fa-star" />
      ))}
    </div>
  );
}

function ProductDetailScreen() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggleItem, trackView, recentlyViewed, itemCount: wishlistCount } = useWishlist();
  const { showToast, openCart: openCartUI, openWishlist } = useUI();

  const product = productIndex[productId];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? null);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? null);
  const [addedToBag, setAddedToBag] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Zoom lens state
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageWrapRef = useRef(null);

  // Sizing assistant state
  const [sizeAssistantOpen, setSizeAssistantOpen] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (productId) trackView(productId);
    // reset image index when product changes
    setActiveImageIdx(0);
    setSelectedSize(product?.sizes?.[0] ?? null);
    setSelectedColor(product?.colors?.[0] ?? null);
    setAddedToBag(false);
    setSizeError(false);
  }, [productId]);

  const wishlisted = product ? isWishlisted(product.id) : false;

  // Wishlist pulse state
  const [pulsing, setPulsing] = useState(false);

  const handleWishlistToggle = () => {
    if (!product) return;
    const wasWishlisted = isWishlisted(product.id);
    toggleItem(product.id);
    showToast(
      wasWishlisted
        ? `${product.title} removed from wishlist.`
        : `${product.title} added to your wishlist.`,
      "success"
    );
    setPulsing(true);
    setTimeout(() => setPulsing(false), 350);
  };

  if (!product) {
    return (
      <div className={styles.page}>
        <Navbar items={NAV_ITEMS} brand="LUXE" />
        <div className={styles.notFound}>
          <i className="fa-solid fa-circle-xmark" />
          <h1 className={styles.notFoundTitle}>Product not found</h1>
          <p className={styles.notFoundDesc}>
            This item may have been removed or the link is incorrect.
          </p>
          <button
            type="button"
            className={styles.notFoundBtn}
            onClick={() => navigate("/products")}
          >
            Browse All Collections
          </button>
        </div>
        <Footer title="LUXE" links={FOOTER_LINKS} />
      </div>
    );
  }

  const relatedProducts = (product.relatedProducts ?? [])
    .map((id) => productIndex[id])
    .filter(Boolean)
    .slice(0, 4);

  const recentlyViewedProducts = recentlyViewed
    .filter((id) => id !== productId)
    .map((id) => productIndex[id])
    .filter(Boolean)
    .slice(0, 4);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, selectedSize, selectedColor);
    showToast(`${product.title} (${selectedSize}) added to your bag.`, "success");
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2500);
    openCartUI();
  };

  const handleRelatedClick = (id) => {
    navigate(`/products/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleZoomMove = useCallback((e) => {
    const rect = imageWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }, []);

  return (
    <div className={styles.page}>
      <Navbar items={NAV_ITEMS} brand="LUXE" />

      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumbWrap}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <a href="/" className={styles.breadcrumbLink} onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            Home
          </a>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <a href="/products" className={styles.breadcrumbLink} onClick={(e) => { e.preventDefault(); navigate("/products"); }}>
            {product.category}
          </a>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>{product.title}</span>
        </nav>
      </div>

      {/* ── Main PDP Grid ── */}
      <div className={styles.pdpWrap}>
        <div className={styles.pdpGrid}>

          {/* ── Media pane (7 cols desktop) ── */}
          <div className={styles.mediaPane}>
            {/* Thumbnail strip */}
            <div className={styles.thumbnailStack}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.thumb} ${activeImageIdx === idx ? styles.thumbActive : ""}`}
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt="" className={styles.thumbImg} />
                </button>
              ))}
            </div>

            {/* Main image with zoom lens */}
            <div
              ref={imageWrapRef}
              className={`${styles.mainImageWrap} ${zoomActive ? styles.mainImageZooming : ""}`}
              onMouseEnter={() => setZoomActive(true)}
              onMouseLeave={() => setZoomActive(false)}
              onMouseMove={handleZoomMove}
            >
              <img
                src={product.images[activeImageIdx]}
                alt={product.title}
                className={styles.mainImage}
                style={zoomActive ? { transform: "scale(1.02)" } : undefined}
              />
              {zoomActive && (
                <div
                  className={styles.zoomLens}
                  aria-hidden="true"
                  style={{
                    backgroundImage: `url(${product.images[activeImageIdx]})`,
                    backgroundSize: "250% 250%",
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
              )}
              <button
                type="button"
                className={`${styles.pdpWishlistBtn} ${wishlisted ? styles.pdpWishlistBtnActive : ""}`}
                onClick={handleWishlistToggle}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <i
                  className={`${wishlisted ? "fa-solid" : "fa-regular"} fa-heart ${pulsing ? styles.heartPulse : ""}`}
                />
              </button>
              {product.limitedEdition && (
                <span className={styles.mainBadge}>Limited Edition</span>
              )}
              {product.newArrival && !product.limitedEdition && (
                <span className={`${styles.mainBadge} ${styles.mainBadgeNew}`}>
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* ── Info pane (5 cols desktop) ── */}
          <div className={styles.infoPane}>
            <span className={styles.categoryTag}>{product.category}</span>
            <h1 className={styles.productTitle}>{product.title}</h1>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} />
              <span className={styles.ratingText}>
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className={styles.originalPrice}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className={styles.discountBadge}>
                    −{product.discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Colour selector */}
            <div className={styles.selectorSection}>
              <span className={styles.selectorLabel}>
                Colour
                {selectedColor && (
                  <span className={styles.selectorValue}> — {selectedColor}</span>
                )}
              </span>
              <div className={styles.colorSwatches}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.colorSwatch} ${selectedColor === color ? styles.colorSwatchActive : ""}`}
                    style={{ "--swatch": COLOR_MAP[color] ?? "#CCCCCC" }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className={styles.selectorSection}>
              <div className={styles.sizeHeader}>
                <span
                  className={`${styles.selectorLabel} ${sizeError ? styles.selectorLabelError : ""}`}
                >
                  {sizeError
                    ? "Please select a size to continue"
                    : selectedSize
                    ? `Size — ${selectedSize}`
                    : "Select Size"}
                </span>
                <button
                  type="button"
                  className={styles.sizeGuideLink}
                  onClick={() => setSizeAssistantOpen(true)}
                >
                  <i className="fa-solid fa-ruler" aria-hidden="true" />
                  Calculate your size
                </button>
              </div>
              <div className={styles.sizeGrid}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ""}`}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className={styles.ctaGroup}>
              <button
                type="button"
                className={`${styles.addToBagBtn} ${addedToBag ? styles.addedToBagBtn : ""}`}
                onClick={handleAddToBag}
              >
                <i className={addedToBag ? "fa-solid fa-check" : "fa-solid fa-bag-shopping"} aria-hidden="true" />
                <span>{addedToBag ? "ADDED TO BAG" : "ADD TO BAG"}</span>
              </button>
              <button
                type="button"
                className={`${styles.wishlistCta} ${wishlisted ? styles.wishlistCtaActive : ""}`}
                onClick={handleWishlistToggle}
              >
                <i className={`${wishlisted ? "fa-solid" : "fa-regular"} fa-heart ${pulsing ? styles.heartPulse : ""}`} aria-hidden="true" />
                <span>
                  {wishlisted ? "IN YOUR WISHLIST" : "ADD TO EDITORIAL WISHLIST"}
                </span>
              </button>
            </div>

            {/* Accordions */}
            <div className={styles.accordions}>
              <details className={styles.accordionItem} open>
                <summary className={styles.accordionSummary}>
                  <span>Sourcing &amp; Composition</span>
                  <i className={`fa-solid fa-angle-down ${styles.accordionIcon}`} aria-hidden="true" />
                </summary>
                <div className={styles.accordionBody}>
                  <p>{product.description}</p>
                  {product.sku && (
                    <p className={styles.skuLine}>SKU: {product.sku}</p>
                  )}
                </div>
              </details>

              <details className={styles.accordionItem}>
                <summary className={styles.accordionSummary}>
                  <span>Delivery &amp; Returns</span>
                  <i className={`fa-solid fa-angle-down ${styles.accordionIcon}`} aria-hidden="true" />
                </summary>
                <div className={styles.accordionBody}>
                  {product.deliveryInfo && <p>{product.deliveryInfo}</p>}
                  {product.returnPolicy && (
                    <p className={styles.returnLine}>{product.returnPolicy}</p>
                  )}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recently Viewed ── */}
      {recentlyViewedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.relatedInner}>
            <span className={styles.relatedEyebrow}>Your Journey</span>
            <h2 className={styles.relatedTitle}>Recently Viewed Silhouettes</h2>
            <div className={styles.relatedGrid}>
              {recentlyViewedProducts.map((p) => (
                <article
                  key={p.id}
                  className={styles.relatedCard}
                  onClick={() => handleRelatedClick(p.id)}
                >
                  <div className={styles.relatedImageWrap}>
                    <img src={p.images?.[0]} alt={p.title} className={styles.relatedImagePrimary} />
                    <img src={p.images?.[1] ?? p.images?.[0]} alt="" aria-hidden="true" className={styles.relatedImageSecondary} />
                  </div>
                  <div className={styles.relatedCardFooter}>
                    <div>
                      <h3 className={styles.relatedProductTitle}>{p.title}</h3>
                      <p className={styles.relatedProductCategory}>{p.category}</p>
                    </div>
                    <span className={styles.relatedProductPrice}>${p.price.toFixed(2)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className={`${styles.relatedSection} ${recentlyViewedProducts.length > 0 ? styles.relatedSectionAlt : ""}`}>
          <div className={styles.relatedInner}>
            <span className={styles.relatedEyebrow}>Curated For You</span>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p) => (
                <article
                  key={p.id}
                  className={styles.relatedCard}
                  onClick={() => handleRelatedClick(p.id)}
                >
                  <div className={styles.relatedImageWrap}>
                    <img src={p.images?.[0]} alt={p.title} className={styles.relatedImagePrimary} />
                    <img src={p.images?.[1] ?? p.images?.[0]} alt="" aria-hidden="true" className={styles.relatedImageSecondary} />
                  </div>
                  <div className={styles.relatedCardFooter}>
                    <div>
                      <h3 className={styles.relatedProductTitle}>{p.title}</h3>
                      <p className={styles.relatedProductCategory}>{p.category}</p>
                    </div>
                    <span className={styles.relatedProductPrice}>${p.price.toFixed(2)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer title="LUXE" links={FOOTER_LINKS} />

      {/* ── Mobile Quick Add ── */}
      <div className={styles.mobileQuickAdd}>
        <div className={styles.mobileQuickAddInfo}>
          <p className={styles.mobileQuickAddTitle}>{product.title}</p>
          <p className={styles.mobileQuickAddSub}>
            {selectedSize ? `Size ${selectedSize}` : "Select a size"} · ${product.price.toFixed(2)}
          </p>
        </div>
        <button type="button" className={styles.mobileQuickAddBtn} onClick={handleAddToBag}>
          QUICK ADD
        </button>
      </div>

      {/* ── Mobile Bottom Nav ── */}
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
        <button type="button" className={styles.mobileNavBtn} onClick={openCartUI}>
          <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
          <span>Bag</span>
        </button>
      </nav>

      {/* ── Sizing Assistant Modal ── */}
      <SizingAssistantModal
        open={sizeAssistantOpen}
        onClose={() => setSizeAssistantOpen(false)}
        onApply={(size) => {
          setSelectedSize(size);
          setSizeError(false);
        }}
        sizes={product.sizes}
      />
    </div>
  );
}

export default ProductDetailScreen;
