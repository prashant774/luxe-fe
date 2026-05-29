import styles from "./SearchBar.module.css";

function SearchBar({
  value,
  onChange,
  placeholder = "Search products",
  label = "Search",
}) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label}
      />
    </label>
  );
}

export default SearchBar;
