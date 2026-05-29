import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SkeletonCard from "../components/SkeletonCard/SkeletonCard";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useUI } from "../hooks/useUI";
import styles from "../styles/ProductListingScreen.module.css";
import { products } from "../utils/data";

const NAV_ITEMS = [
  { label: "Shop All", href: "#" },
  { label: "Outerwear", href: "#" },
  { label: "Knitwear", href: "#" },
  { label: "Trousers", href: "#" },
];

const FOOTER_LINKS = [
  { label: "Gabardine Outerwear", href: "#" },
  { label: "Inner Cashmere Knitwear", href: "#" },
  { label: "Structured Blazers", href: "#" },
];

const ALL_CATEGORIES = [...new Set(products.map((p) => p.category))].sort();
const ALL_SIZES = [
  "XS", "S", "M", "L", "XL",
  "US 7", "US 8", "US 9", "US 10", "US 11",
  "One Size",
];
const ALL_COLORS = [...new Set(products.flatMap((p) => p.colors))].sort();

const PRICE_RANGES = [
  { id: "under75",  label: "Under $75",     min: 0,   max: 75       },
  { id: "75-150",   label: "$75 – $150",    min: 75,  max: 150      },
  { id: "150-250",  label: "$150 – $250",   min: 150, max: 250      },
  { id: "over250",  label: "Over $250",     min: 250, max: Infinity },
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First"        },
  { value: "price-asc",  label: "Price: Low to High"  },
  { value: "price-desc", label: "Price: High to Low"  },
  { value: "rating",     label: "Highest Rated"       },
];

const RATING_OPTIONS = [
  { value: 4.5, label: "4.5 & Up" },
  { value: 4.0, label: "4.0 & Up" },
  { value: 3.5, label: "3.5 & Up" },
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

const ITEMS_PER_PAGE = 6;

/* ── Sub-components (module-level, stable) ── */

function FilterAccordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.filterGroup}>
      <button
        type="button"
        className={styles.filterGroupHeader}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <i
          className={`fa-solid ${open ? "fa-minus" : "fa-plus"} ${styles.filterGroupIcon}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className={styles.filterGroupBody}>{children}</div>}
    </div>
  );
}

function FilterContent({
  selectedCategories, toggleCategory,
  selectedPriceRange, setSelectedPriceRange,
  selectedSizes, toggleSize,
  selectedColors, toggleColor,
  minRating, setMinRating,
  activeFilterCount, clearAllFilters,
}) {
  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterPanelHeader}>
        <span className={styles.filterPanelTitle}>Filters</span>
        {activeFilterCount > 0 && (
          <button type="button" className={styles.clearFiltersBtn} onClick={clearAllFilters}>
            Clear All
          </button>
        )}
      </div>

      <FilterAccordion title="Category" defaultOpen={true}>
        <div className={styles.filterCheckList}>
          {ALL_CATEGORIES.map((cat) => (
            <label key={cat} className={styles.filterCheckItem}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className={styles.filterCheckbox}
              />
              <span className={styles.filterCheckLabel}>{cat}</span>
              <span className={styles.filterCheckCount}>
                {products.filter((p) => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Price" defaultOpen={true}>
        <div className={styles.filterCheckList}>
          {PRICE_RANGES.map((range) => (
            <label key={range.id} className={styles.filterCheckItem}>
              <input
                type="checkbox"
                checked={selectedPriceRange === range.id}
                onChange={() =>
                  setSelectedPriceRange(
                    selectedPriceRange === range.id ? null : range.id
                  )
                }
                className={styles.filterCheckbox}
              />
              <span className={styles.filterCheckLabel}>{range.label}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Size" defaultOpen={false}>
        <div className={styles.filterSizeGrid}>
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.filterSizeBtn} ${selectedSizes.includes(size) ? styles.filterSizeBtnActive : ""}`}
              onClick={() => toggleSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Colour" defaultOpen={false}>
        <div className={styles.filterColorGrid}>
          {ALL_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`${styles.filterColorBtn} ${selectedColors.includes(color) ? styles.filterColorBtnActive : ""}`}
              onClick={() => toggleColor(color)}
              title={color}
              aria-label={color}
              style={{ "--swatch": COLOR_MAP[color] || "#CCCCCC" }}
            />
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Rating" defaultOpen={false}>
        <div className={styles.filterCheckList}>
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className={styles.filterCheckItem}>
              <input
                type="checkbox"
                checked={minRating === opt.value}
                onChange={() =>
                  setMinRating(minRating === opt.value ? 0 : opt.value)
                }
                className={styles.filterCheckbox}
              />
              <span className={styles.filterCheckLabel}>
                {Array.from({ length: 5 }, (_, i) => (
                  <i
                    key={i}
                    className={`${i < opt.value ? "fa-solid" : "fa-regular"} fa-star`}
                    style={{
                      fontSize: "0.625rem",
                      color: i < opt.value ? "#F59E0B" : "#D1D5DB",
                    }}
                    aria-hidden="true"
                  />
                ))}
                <span style={{ marginLeft: "0.25rem" }}>{opt.label}</span>
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>
    </div>
  );
}

/* ── Main Screen ── */

function ProductListingScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const { isWishlisted, toggleItem, itemCount: wishlistCount } = useWishlist();
  const { showToast, openCart: openCartUI, openWishlist } = useUI();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get("category");
    return cat ? [cat] : [];
  });
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const searchTimerRef = useRef(null);

  /* Simulate initial load */
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  /* Debounce search */
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setVisibleCount(ITEMS_PER_PAGE);
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchQuery]);

  /* Reset pagination on filter/sort change */
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategories, selectedPriceRange, selectedSizes, selectedColors, minRating, sortBy]);

  const toggleCategory = useCallback(
    (cat) =>
      setSelectedCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      ),
    []
  );

  const toggleSize = useCallback(
    (size) =>
      setSelectedSizes((prev) =>
        prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
      ),
    []
  );

  const toggleColor = useCallback(
    (color) =>
      setSelectedColors((prev) =>
        prev.includes(color)
          ? prev.filter((c) => c !== color)
          : [...prev, color]
      ),
    []
  );

  const toggleWishlist = useCallback((product, e) => {
    if (e) e.stopPropagation();
    const wasWishlisted = isWishlisted(product.id);
    toggleItem(product.id);
    showToast(
      wasWishlisted
        ? `${product.title} removed from wishlist.`
        : `${product.title} added to your wishlist.`,
      "success"
    );
  }, [isWishlisted, toggleItem, showToast]);

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinRating(0);
    setSearchQuery("");
    setDebouncedSearch("");
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedPriceRange) {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (range) {
        result = result.filter(
          (p) => p.price >= range.min && p.price < range.max
        );
      }
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c))
      );
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [
    debouncedSearch, selectedCategories, selectedPriceRange,
    selectedSizes, selectedColors, minRating, sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const activeFilterCount =
    selectedCategories.length +
    (selectedPriceRange ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (minRating > 0 ? 1 : 0);

  const activeChips = [
    ...selectedCategories.map((c) => ({ type: "category", value: c, label: c })),
    ...(selectedPriceRange
      ? [{
          type: "price",
          value: selectedPriceRange,
          label: PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.label,
        }]
      : []),
    ...selectedSizes.map((s) => ({ type: "size", value: s, label: s })),
    ...selectedColors.map((c) => ({ type: "color", value: c, label: c })),
    ...(minRating > 0
      ? [{ type: "rating", value: minRating, label: `${minRating}+ Stars` }]
      : []),
  ];

  const removeChip = (chip) => {
    switch (chip.type) {
      case "category": toggleCategory(chip.value); break;
      case "price":    setSelectedPriceRange(null); break;
      case "size":     toggleSize(chip.value);      break;
      case "color":    toggleColor(chip.value);     break;
      case "rating":   setMinRating(0);             break;
    }
  };

  const filterProps = {
    selectedCategories, toggleCategory,
    selectedPriceRange, setSelectedPriceRange,
    selectedSizes, toggleSize,
    selectedColors, toggleColor,
    minRating, setMinRating,
    activeFilterCount, clearAllFilters,
  };

  return (
    <div className={styles.page}>
      <Navbar items={NAV_ITEMS} brand="LUXE" />

      {/* ── Page Header ── */}
      <div className={styles.pageHeaderWrap}>
        <div className={styles.pageHeaderInner}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <a href="/" className={styles.breadcrumbLink}>Home</a>
            <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
            <span className={styles.breadcrumbCurrent}>All Collections</span>
          </nav>
          <h1 className={styles.pageTitle}>The Collection</h1>
          <p className={styles.pageDesc}>
            Curated editorial releases — each piece selected for refined
            construction and premium material sourcing.
          </p>
        </div>
      </div>

      {/* ── Sticky Toolbar ── */}
      <div className={styles.toolbarWrap}>
        <div className={styles.toolbarInner}>
          <div className={styles.toolbarLeft}>
            <span className={styles.productCount}>
              {isLoading ? "—" : `${filteredProducts.length} pieces`}
            </span>
            <div className={styles.searchBox}>
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
          </div>

          <div className={styles.toolbarRight}>
            {/* Filter button — mobile/tablet only, hidden on desktop via CSS */}
            <button
              type="button"
              className={`${styles.filterToggleBtn} ${activeFilterCount > 0 ? styles.filterToggleBtnActive : ""}`}
              onClick={() => setFilterDrawerOpen(true)}
              aria-label="Open filters"
            >
              <i className="fa-solid fa-sliders" aria-hidden="true" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </button>

            <div className={styles.sortWrap}>
              <label htmlFor="plp-sort" className={styles.sortLabel}>
                Sort
              </label>
              <select
                id="plp-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className={styles.chipsWrap}>
            <div className={styles.chipsInner}>
              {activeChips.map((chip, i) => (
                <button
                  key={`${chip.type}-${chip.value}-${i}`}
                  type="button"
                  className={styles.chip}
                  onClick={() => removeChip(chip)}
                >
                  {chip.label}
                  <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                className={styles.chipClearAll}
                onClick={clearAllFilters}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Main Layout: sidebar + grid ── */}
      <div className={styles.mainWrap}>
        <div className={styles.mainInner}>
          {/* Desktop sidebar — hidden on mobile via CSS */}
          <aside className={styles.desktopSidebar} aria-label="Product filters">
            <FilterContent {...filterProps} />
          </aside>

          {/* Products area */}
          <div className={styles.productsArea}>
            {isLoading ? (
              <div className={styles.productsGrid}>
                {Array.from({ length: 6 }, (_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.noResults}>
                <i className="fa-solid fa-circle-xmark" aria-hidden="true" />
                <h2 className={styles.noResultsTitle}>No pieces found</h2>
                <p className={styles.noResultsDesc}>
                  Try adjusting your filters or search term.
                </p>
                <button
                  type="button"
                  className={styles.noResultsBtn}
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={styles.productsGrid}>
                  {visibleProducts.map((product) => (
                    <article key={product.id} className={styles.productCard} onClick={() => navigate('/products/' + product.id)}>
                      <div className={styles.productImageWrap}>
                        <img
                          src={product.images?.[0]}
                          alt={product.title}
                          className={styles.productImagePrimary}
                        />
                        <img
                          src={product.images?.[1] ?? product.images?.[0]}
                          alt=""
                          aria-hidden="true"
                          className={styles.productImageSecondary}
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
                            className={
                              isWishlisted(product.id)
                                ? "fa-solid fa-heart"
                                : "fa-regular fa-heart"
                            }
                          />
                        </button>
                        {product.limitedEdition && (
                          <span className={styles.productBadge}>Limited</span>
                        )}
                        {product.newArrival && !product.limitedEdition && (
                          <span
                            className={`${styles.productBadge} ${styles.productBadgeNew}`}
                          >
                            New
                          </span>
                        )}
                        {/* Quick Add Size bar (slides up on hover) */}
                        <div className={styles.quickAddBar}>
                          <p className={styles.quickAddLabel}>QUICK ADD SIZE</p>
                          <div className={styles.quickAddSizes}>
                            {product.sizes.slice(0, 6).map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                className={styles.quickAddSizeBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItem(product, sz, product.colors?.[0] ?? "");
                                  showToast(`${product.title} (${sz}) added to your bag.`, "success");
                                  openCartUI();
                                }}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className={styles.productCardFooter}>
                        <div>
                          <h3 className={styles.productTitle}>
                            {product.title}
                          </h3>
                          <p className={styles.productCategory}>
                            {product.category}
                          </p>
                        </div>
                        <span className={styles.productPrice}>
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                {hasMore && (
                  <div className={styles.loadMoreWrap}>
                    <button
                      type="button"
                      className={styles.loadMoreBtn}
                      onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                    >
                      Load More Pieces
                      <i className="fa-solid fa-arrow-down" aria-hidden="true" />
                    </button>
                    <p className={styles.loadMoreMeta}>
                      Showing {visibleCount} of {filteredProducts.length}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer title="LUXE" links={FOOTER_LINKS} />

      {/* ── Mobile Bottom Nav (hidden on ≥768px) ── */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
        <button type="button" className={styles.mobileNavBtn} onClick={() => navigate("/")}>
          <i className="fa-solid fa-house" aria-hidden="true" />
          <span>Home</span>
        </button>
        <button type="button" className={`${styles.mobileNavBtn} ${styles.mobileNavBtnActive}`}>
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

      {/* ── Mobile Filter Drawer (hidden on ≥1024px) ── */}
      {filterDrawerOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setFilterDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`${styles.filterDrawer} ${filterDrawerOpen ? styles.filterDrawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Filters</span>
          <button
            type="button"
            className={styles.drawerCloseBtn}
            onClick={() => setFilterDrawerOpen(false)}
            aria-label="Close filters"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className={styles.drawerBody}>
          <FilterContent {...filterProps} />
        </div>
        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.drawerApplyBtn}
            onClick={() => setFilterDrawerOpen(false)}
          >
            View {filteredProducts.length} Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductListingScreen;
