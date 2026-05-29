import styles from "./Modal.module.css";

function Modal({ open = false, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <dialog
        open
        className={styles.modal}
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h3 id="modal-title" className={styles.title}>
            {title}
          </h3>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </dialog>
    </div>
  );
}

export default Modal;
