import styles from "./ProductGrid.module.css";

function ProductGrid({ children, columns = 4 }) {
  return (
    <section
      className={styles.grid}
      data-columns={columns}
      aria-label="Product grid"
    >
      {children}
    </section>
  );
}

export default ProductGrid;
