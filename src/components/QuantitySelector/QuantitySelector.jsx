import { useState } from "react";
import styles from "./QuantitySelector.module.css";

function QuantitySelector({ min = 1, max = 10, initial = 1, onChange }) {
  const [value, setValue] = useState(initial);

  const update = (next) => {
    const safe = Math.min(max, Math.max(min, next));
    setValue(safe);
    onChange?.(safe);
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.button}
        onClick={() => update(value - 1)}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <output className={styles.value} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={styles.button}
        onClick={() => update(value + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
