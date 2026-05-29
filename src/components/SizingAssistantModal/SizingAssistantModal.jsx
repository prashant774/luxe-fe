import { useState } from "react";
import styles from "./SizingAssistantModal.module.css";

const PREFERENCES = ["Tight", "True to Size", "Relaxed"];

function recommendSize(height, weight, preference, sizes) {
  if (!sizes || sizes.length === 0) return "M";
  const bmi = weight / ((height / 100) ** 2);
  let base;
  if (bmi < 18.5) base = 0;
  else if (bmi < 22) base = 1;
  else if (bmi < 25) base = 2;
  else if (bmi < 28) base = 3;
  else base = 4;

  if (preference === "Tight") base = Math.max(0, base - 1);
  else if (preference === "Relaxed") base = Math.min(sizes.length - 1, base + 1);

  return sizes[Math.min(base, sizes.length - 1)] ?? sizes[0] ?? "M";
}

function SizingContent({ onClose, onApply, sizes }) {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [preference, setPreference] = useState("True to Size");
  const recommended = recommendSize(height, weight, preference, sizes);

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <h3 className={styles.title}>Sizing Assistant</h3>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </div>

      <div className={styles.body}>
        {/* Height */}
        <div className={styles.sliderGroup}>
          <label htmlFor="sizing-height" className={styles.sliderLabel}>
            <span>Height</span>
            <span className={styles.sliderVal}>{height} cm</span>
          </label>
          <input
            id="sizing-height"
            type="range"
            min={150}
            max={210}
            step={1}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className={styles.slider}
            aria-valuemin={150}
            aria-valuemax={210}
            aria-valuenow={height}
            aria-valuetext={`${height} cm`}
          />
          <div className={styles.sliderRange}>
            <span>150 cm</span>
            <span>210 cm</span>
          </div>
        </div>

        {/* Weight */}
        <div className={styles.sliderGroup}>
          <label htmlFor="sizing-weight" className={styles.sliderLabel}>
            <span>Weight</span>
            <span className={styles.sliderVal}>{weight} kg</span>
          </label>
          <input
            id="sizing-weight"
            type="range"
            min={45}
            max={120}
            step={1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className={styles.slider}
            aria-valuemin={45}
            aria-valuemax={120}
            aria-valuenow={weight}
            aria-valuetext={`${weight} kg`}
          />
          <div className={styles.sliderRange}>
            <span>45 kg</span>
            <span>120 kg</span>
          </div>
        </div>

        {/* Preference */}
        <div className={styles.prefGroup}>
          <p className={styles.prefLabel}>Fit Preference</p>
          <div className={styles.prefBtns}>
            {PREFERENCES.map((p) => (
              <button
                key={p}
                type="button"
                className={`${styles.prefBtn} ${preference === p ? styles.prefBtnActive : ""}`}
                onClick={() => setPreference(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className={styles.result}>
          <p className={styles.resultLabel}>Recommended Fit Matrix</p>
          <p className={styles.resultSize}>{recommended}</p>
          <p className={styles.resultHint}>Based on your measurements and preference</p>
        </div>
      </div>

      <button
        type="button"
        className={styles.applyBtn}
        onClick={() => { onApply(recommended); onClose(); }}
      >
        Apply Calculated Size State
      </button>
    </div>
  );
}

function SizingAssistantModal({ open, onClose, onApply, sizes = [] }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog" aria-label="Sizing assistant">
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <SizingContent onClose={onClose} onApply={onApply} sizes={sizes} />
    </div>
  );
}

export default SizingAssistantModal;
