import styles from "./ProductBadge.module.css";

function ProductBadge({ children, tone = "featured" }) {
  return (
    <span className={[styles.badge, styles[tone]].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}

export default ProductBadge;
