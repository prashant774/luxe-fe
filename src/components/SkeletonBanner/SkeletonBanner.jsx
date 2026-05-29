import styles from "./SkeletonBanner.module.css";

function SkeletonBanner() {
  return <div className={styles.banner} aria-hidden="true" />;
}

export default SkeletonBanner;
