import styles from "./RatingStars.module.css";

function RatingStars({ rating = 0, reviewCount = 0 }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className={styles.row} aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={[styles.star, i < rounded ? styles.filled : ""]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className={styles.count}>({reviewCount})</span>
    </div>
  );
}

export default RatingStars;
