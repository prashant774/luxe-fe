import styles from "./WishlistButton.module.css";

function WishlistButton({
  active = false,
  onClick,
  ariaLabel = "Toggle wishlist",
}) {
  return (
    <button
      type="button"
      className={[styles.button, active ? styles.active : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      ♥
    </button>
  );
}

export default WishlistButton;
