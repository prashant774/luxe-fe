import styles from "./Footer.module.css";

function Footer({ title = "LUXE", links = [] }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.column}>
          <span className={styles.brand}>{title}.</span>
          <p className={styles.description}>
            Curated minimalist fashion treating structural patterns as artistic
            modules. Optimized for modern transitions.
          </p>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Seasonal Collections</h4>
          <ul className={styles.list}>
            {links.map((item) => (
              <li key={item.label}>
                <a className={styles.link} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Client Assistance</h4>
          <ul className={styles.list}>
            <li>
              <a className={styles.link} href="/products">
                Sizing Dynamics
              </a>
            </li>
            <li>
              <a className={styles.link} href="/products">
                Courier Delivery Matrix
              </a>
            </li>
            <li>
              <a className={styles.link} href="/products">
                Carbon Neutral Initiatives
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Sourcing Digest</h4>
          <p className={styles.description}>
            Sign up to receive private notifications on upcoming limited capsule
            drops.
          </p>
          <div className={styles.subscribeBox}>
            <input
              type="email"
              placeholder="Your email address"
              className={styles.input}
              aria-label="Email address for newsletter"
            />
            <button type="button" className={styles.subscribeButton} aria-label="Subscribe to newsletter">
              OK
            </button>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>
          © 2026 LUXE. Design Studio Corp. All specifications optimized for
          senior development paradigms.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
