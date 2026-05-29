import styles from "./CategoryChip.module.css";

function CategoryChip({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      className={[styles.chip, active ? styles.active : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default CategoryChip;
