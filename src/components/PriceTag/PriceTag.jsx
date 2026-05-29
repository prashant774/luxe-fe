import styles from "./PriceTag.module.css";

function PriceTag({ price = 0, originalPrice = 0 }) {
  return (
    <div className={styles.wrap}>
      <strong className={styles.current}>$ {price.toFixed(0)}</strong>
      {originalPrice && originalPrice > price ? (
        <span className={styles.original}>$ {originalPrice.toFixed(0)}</span>
      ) : null}
    </div>
  );
}

export default PriceTag;
