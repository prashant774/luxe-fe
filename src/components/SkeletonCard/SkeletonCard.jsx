import styles from "./SkeletonCard.module.css";

function SkeletonCard() {
  return (
    <article className={styles.card} aria-hidden="true">
      <div className={styles.media} />
      <div className={styles.content}>
        <div className={styles.lineShort} />
        <div className={styles.lineLong} />
        <div className={styles.lineMedium} />
      </div>
    </article>
  );
}

export default SkeletonCard;
