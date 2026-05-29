import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../../hooks/useUI";
import { products } from "../../utils/data";
import styles from "./SearchModal.module.css";

const TRENDING = [
  "Gabardine Trench",
  "Cashmere Knitwear",
  "Virgin Wool",
  "Winter Tailoring",
];

function SearchModal() {
  const { searchOpen, closeSearch } = useUI();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setDebouncedQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && searchOpen) closeSearch();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [searchOpen, closeSearch]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 200);
  };

  const suggestions = debouncedQuery.trim().length > 1
    ? products
        .filter((p) =>
          p.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(debouncedQuery.toLowerCase())
        )
        .slice(0, 3)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate("/products");
      closeSearch();
    }
  };

  const handleTrending = (term) => {
    navigate("/products");
    closeSearch();
  };

  const handleSuggestion = (productId) => {
    navigate(`/products/${productId}`);
    closeSearch();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${searchOpen ? styles.backdropVisible : ""}`}
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={`${styles.modal} ${searchOpen ? styles.modalVisible : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <form onSubmit={handleSubmit} className={styles.searchRow}>
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search seasonal collections…"
            value={query}
            onChange={handleQueryChange}
            aria-label="Search products"
          />
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeSearch}
            aria-label="Close search"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </form>

        {/* Trending searches */}
        {debouncedQuery.trim().length === 0 && (
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Trending Searches</p>
            <div className={styles.pills}>
              {TRENDING.map((term) => (
                <button
                  key={term}
                  type="button"
                  className={styles.pill}
                  onClick={() => handleTrending(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live suggestions */}
        {debouncedQuery.trim().length > 1 && (
          <div className={styles.section}>
            <div className={styles.suggestionsHeader}>
              <p className={styles.sectionLabel}>Matched Suggestions</p>
              {suggestions.length > 0 && (
                <button
                  type="button"
                  className={styles.viewAll}
                  onClick={() => { navigate("/products"); closeSearch(); }}
                >
                  View All <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </button>
              )}
            </div>
            {suggestions.length === 0 ? (
              <p className={styles.noResults}>
                No results for "{debouncedQuery}" — try a different term.
              </p>
            ) : (
              <div className={styles.suggestions}>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={styles.suggestion}
                    onClick={() => handleSuggestion(p.id)}
                  >
                    <img
                      src={p.thumbnail ?? p.images?.[0]}
                      alt={p.title}
                      className={styles.suggestionThumb}
                    />
                    <div className={styles.suggestionInfo}>
                      <p className={styles.suggestionTitle}>{p.title}</p>
                      <p className={styles.suggestionPrice}>${p.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchModal;
