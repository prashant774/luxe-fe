import styles from "./InputField.module.css";

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  ...props
}) {
  return (
    <label className={styles.field}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input
        type={type}
        className={[styles.input, error ? styles.error : ""]
          .filter(Boolean)
          .join(" ")}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </label>
  );
}

export default InputField;
