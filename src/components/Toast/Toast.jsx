import { useUI } from "../../hooks/useUI";
import styles from "./Toast.module.css";

function Toast() {
  const { toast, showToast } = useUI();

  const handleClose = () => {
    showToast("", "success");
  };

  return (
    <div
      className={`${styles.wrap} ${toast.visible ? styles.visible : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <i
        className={`fa-solid ${toast.type === "success" ? "fa-check" : "fa-circle-info"} ${styles.icon}`}
        aria-hidden="true"
      />
      <span className={styles.message}>{toast.message}</span>
      <button
        type="button"
        className={styles.close}
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        <i className="fa-solid fa-xmark" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Toast;
