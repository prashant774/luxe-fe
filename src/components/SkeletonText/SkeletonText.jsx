import styles from "./SkeletonText.module.css";

function SkeletonText({ width = "100%" }) {
  return <div className={styles.line} style={{ width }} aria-hidden="true" />;
}

export default SkeletonText;
