import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { useWishlist } from "../hooks/useWishlist";
import { useUI } from "../hooks/useUI";
import styles from "../styles/HomeScreen.module.css";
import { products } from "../utils/data";
import { NAV_ITEMS, FOOTER_LINKS } from "../utils/constants";

const CATEGORIES = [
  { id: "outerwear", label: "Outerwear", icon: "fa-solid fa-shirt" },
  { id: "knitwear", label: "Knitwear", icon: "fa-solid fa-scissors" },
  { id: "tailoring", label: "Tailoring", icon: "fa-solid fa-user-tie" },
  { id: "trousers", label: "Trousers", icon: "fa-solid fa-ellipsis" },
];

function HomeScreen() {
  const navigate = useNavigate();
  const { isWishlisted, toggleItem, itemCount: wishlistCount } = useWishlist();
  const { showToast, openWishlist, openCart } = useUI();
  const [pulsingId, setPulsingId] = useState(null);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 3),
    [products],
  );

  const toggleWishlist = (product, e) => {
    e?.stopPropagation();
    const wasWishlisted = isWishlisted(product.id);
    toggleItem(product.id);
    showToast(
      wasWishlisted
        ? `${product.title} removed from wishlist.`
        : `${product.title} added to your wishlist.`,
      "success"
    );
    setPulsingId(product.id);
    setTimeout(() => setPulsingId(null), 350);
  };

  return (
    <div className={styles.page}>
      {/* ── Sticky top navbar (desktop + mobile header) ── */}
      <Navbar items={NAV_ITEMS} brand="LUXE" />

      {/* ── 1. HERO SECTION — 50/50 editorial split ── */}
      <section className={styles.heroSection}>
        {/* Text left — 5 cols on desktop */}
        <div className={styles.heroLeft}>
          <span className={styles.heroEyebrow}>New Drop — Autumn Shift</span>
          <h1 className={styles.heroTitle}>The Autumn Silhouette</h1>
          <p className={styles.heroDesc}>
            A structured curation of luxury outerwear designed specifically for
            transition environments. Heavyweight Japanese linen blends meet
            structured cashmere.
          </p>
          <div className={styles.heroButtonRow}>
            <button className={styles.btnPrimary} onClick={() => navigate('/products')}>
              EXPLORE THE COLLECTION
            </button>
            <button className={styles.btnOutline} onClick={() => navigate('/products/' + (featuredProducts[0]?.id ?? ''))}>VIEW CORE ITEM</button>
          </div>
        </div>

        {/* Image right — 7 cols on desktop, with hover scale + glass card */}
        <div className={styles.heroRight}>
          <img
            src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop"
            alt="Autumn Silhouette Model"
            className={styles.heroImage}
          />
          <div className={styles.heroCaptionBox}>
            <p className={styles.heroCaptionTitle}>01 / Minimalist Trench</p>
            <p className={styles.heroCaptionDesc}>
              100% weather-resistant linen gabardine weave.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORY STRIP — full-width accentBg ── */}
      <section className={styles.categoryStrip} aria-label="Browse categories">
        <div className={styles.categoryStripInner}>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className={styles.categoryItem} onClick={() => navigate(`/products?category=${encodeURIComponent(cat.label)}`)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate(`/products?category=${encodeURIComponent(cat.label)}`)} role="button" tabIndex={0}>
                <div className={styles.categoryIconCircle}>
                  <i className={`${cat.icon} ${styles.categoryItemIcon}`} aria-hidden="true" />
                </div>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED PRODUCTS — 3-column editorial grid ── */}
      <section className={styles.productsSection} id="collections">
        <div className={styles.productsSectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>
              Selected Weekly Selection
            </span>
            <h2 className={styles.sectionTitle}>Featured Editorial Releases</h2>
          </div>
          <a href="/products" className={styles.browseAllLink} onClick={(e) => { e.preventDefault(); navigate('/products'); }}>
            <span>Browse All Collection</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </div>

        <div className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <article key={product.id} className={styles.productCard} onClick={() => navigate('/products/' + product.id)}>
              <div className={styles.productImageWrap}>
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className={styles.productImagePrimary}
                  loading="lazy"
                />
                <img
                  src={product.images?.[1] ?? product.images?.[0]}
                  alt=""
                  aria-hidden="true"
                  className={styles.productImageSecondary}
                  loading="lazy"
                />
                <button
                  type="button"
                  className={`${styles.wishlistBtn} ${isWishlisted(product.id) ? styles.wishlistBtnActive : ""}`}
                  onClick={(e) => toggleWishlist(product, e)}
                  aria-label={
                    isWishlisted(product.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <i
                    className={[
                      isWishlisted(product.id) ? "fa-solid fa-heart" : "fa-regular fa-heart",
                      pulsingId === product.id ? styles.heartPulse : "",
                    ].filter(Boolean).join(" ")}
                  />
                </button>
              </div>

              <div className={styles.productCardFooter}>
                <div>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productCategory}>{product.category}</p>
                </div>
                <span className={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 4. SPLIT NARRATIVE BANNER — philosophy section ── */}
      <section className={styles.narrativeSection}>
        <div className={styles.narrativeBanner}>
          {/* Text left */}
          <div className={styles.narrativeLeft}>
            <span className={styles.sectionEyebrow}>Philosophy</span>
            <h3 className={styles.narrativeTitle}>
              Crafting Minimalist Luxury
            </h3>
            <p className={styles.narrativeText}>
              We design each piece as an editorial capsule, minimizing structural
              load for simple styling versatility. Standardized pattern cutting
              eliminates fiber waste by up to 25%.
            </p>
            <a href="/products" className={styles.narrativeLink} onClick={(e) => { e.preventDefault(); navigate("/products"); }}>
              READ OUR SOURCING BLUEPRINT
            </a>
          </div>

          {/* Image right */}
          <div className={styles.narrativeImageWrap}>
            <img
              src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop"
              alt="Design Studio"
              className={styles.narrativeImage}
            />
          </div>
        </div>
      </section>

      {/* ── 5. FOOTER ── */}
      <Footer title="LUXE" links={FOOTER_LINKS} />

      {/* ── 6. MOBILE BOTTOM NAV — ONLY on mobile (<768px) ── */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
        <button type="button" className={`${styles.mobileNavBtn} ${styles.mobileNavBtnActive}`}>
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
        <button type="button" className={styles.mobileNavBtn} onClick={openCart}>
          <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
          <span>Bag</span>
        </button>
      </nav>
    </div>
  );
}

export default HomeScreen;
