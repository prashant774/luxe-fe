import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useCart } from "../hooks/useCart";
import { useUI } from "../hooks/useUI";
import { useWishlist } from "../hooks/useWishlist";
import styles from "../styles/CheckoutScreen.module.css";

const NAV_ITEMS = [
  { label: "Shop All", href: "/products" },
  { label: "Outerwear", href: "/products" },
  { label: "Knitwear", href: "/products" },
  { label: "Trousers", href: "/products" },
];

const FOOTER_LINKS = [
  { label: "Gabardine Outerwear", href: "/products" },
  { label: "Inner Cashmere Knitwear", href: "/products" },
  { label: "Structured Blazers", href: "/products" },
];

function generateRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nums = "0123456789";
  const rand = (s) => s[Math.floor(Math.random() * s.length)];
  return `LX-${Array.from({ length: 6 }, () => rand(nums)).join("")}-${Array.from({ length: 2 }, () => rand(chars)).join("")}`;
}

function CheckoutScreen() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { openWishlist, openCart } = useUI();
  const { itemCount: wishlistCount } = useWishlist();
  const [step, setStep] = useState(1);
  const [orderRef] = useState(generateRef);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearCart();
    setStep(2);
  };

  if (step === 2) {
    return (
      <div className={styles.page}>
        <Navbar items={NAV_ITEMS} brand="LUXE" />
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>
            <i className="fa-solid fa-check" aria-hidden="true" />
          </div>
          <h1 className={styles.successTitle}>Secure order executed</h1>
          <p className={styles.successMsg}>
            Your order specs are successfully processed. A notification with your
            courier tracking details was sent to {form.email || "your email"}.
          </p>
          <div className={styles.orderDetails}>
            <p className={styles.orderDetailRow}>
              <span>Client</span>
              <span>{form.firstName} {form.lastName}</span>
            </p>
            <p className={styles.orderDetailRow}>
              <span>Destination</span>
              <span>{form.address}, {form.city}</span>
            </p>
            <p className={styles.orderDetailRow}>
              <span>Ref Code</span>
              <span className={styles.refCode}>{orderRef}</span>
            </p>
          </div>
          <button
            type="button"
            className={styles.returnBtn}
            onClick={() => navigate("/")}
          >
            RETURN TO MAIN HOMEPAGE
          </button>
        </div>
        <Footer title="LUXE" links={FOOTER_LINKS} />
        <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
          <button type="button" className={styles.mobileNavBtn} onClick={() => navigate("/")}>
            <i className="fa-solid fa-house" aria-hidden="true" />
            <span>Home</span>
          </button>
          <button type="button" className={styles.mobileNavBtn} onClick={() => navigate("/products")}>
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <span>Catalog</span>
          </button>
          <button type="button" className={styles.mobileNavBtn} onClick={openWishlist}>
            <i className="fa-regular fa-heart" aria-hidden="true" />
            {wishlistCount > 0 && <span className={styles.navDot} />}
            <span>Wishlist</span>
          </button>
          <button type="button" className={styles.mobileNavBtn} onClick={openCart}>
            <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
            <span>Bag</span>
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar items={NAV_ITEMS} brand="LUXE" />

      {/* Breadcrumb */}
      <div className={styles.breadcrumbWrap}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <a href="/" className={styles.breadcrumbLink} onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <a href="/cart" className={styles.breadcrumbLink} onClick={(e) => { e.preventDefault(); navigate("/cart"); }}>Cart</a>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>Checkout</span>
        </nav>
      </div>

      <div className={styles.wrap}>
        <div className={styles.layout}>
          {/* ── Left: Form ── */}
          <form className={styles.formCol} onSubmit={handleSubmit}>
            {/* Section 1 */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>1. Contact Specifications</h2>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className={styles.input}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Section 2 */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>2. Courier Destination Address</h2>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="firstName">First Name</label>
                  <input id="firstName" type="text" name="firstName" className={styles.input} value={form.firstName} onChange={handleChange} placeholder="First" required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="lastName">Last Name</label>
                  <input id="lastName" type="text" name="lastName" className={styles.input} value={form.lastName} onChange={handleChange} placeholder="Last" required />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="address">Street Address</label>
                <input id="address" type="text" name="address" className={styles.input} value={form.address} onChange={handleChange} placeholder="123 Main St" required />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="city">City</label>
                  <input id="city" type="text" name="city" className={styles.input} value={form.city} onChange={handleChange} placeholder="City" required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="zip">ZIP / Postal Code</label>
                  <input id="zip" type="text" name="zip" className={styles.input} value={form.zip} onChange={handleChange} placeholder="10001" required />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>3. Payment Parameters</h2>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="cardName">Cardholder Name</label>
                <input id="cardName" type="text" name="cardName" className={styles.input} value={form.cardName} onChange={handleChange} placeholder="As on card" required />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="cardNumber">Credit Card Number</label>
                <input id="cardNumber" type="text" name="cardNumber" className={styles.input} value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19} required />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="expiry">Expiry Date</label>
                  <input id="expiry" type="text" name="expiry" className={styles.input} value={form.expiry} onChange={handleChange} placeholder="MM / YY" maxLength={7} required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="cvv">CVV</label>
                  <input id="cvv" type="text" name="cvv" className={styles.input} value={form.cvv} onChange={handleChange} placeholder="•••" maxLength={4} required />
                </div>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <i className="fa-solid fa-lock" aria-hidden="true" />
              <span>PLACE SECURE ORDER</span>
            </button>
          </form>

          {/* ── Right: Order Summary ── */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryBox}>
              <h3 className={styles.summaryTitle}>Checkout Items</h3>

              {items.length === 0 ? (
                <p className={styles.emptyNote}>Your bag is empty.</p>
              ) : (
                <div className={styles.summaryItems}>
                  {items.map((item, idx) => (
                    <div key={idx} className={styles.summaryItem}>
                      <img
                        src={item.product.images?.[0]}
                        alt={item.product.title}
                        className={styles.summaryThumb}
                      />
                      <div className={styles.summaryItemInfo}>
                        <p className={styles.summaryItemTitle}>{item.product.title}</p>
                        <p className={styles.summaryItemMeta}>Size {item.size} · Qty {item.qty}</p>
                      </div>
                      <span className={styles.summaryItemPrice}>
                        ${(item.product.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Handling</span>
                  <span className={styles.freeLabel}>Express FREE</span>
                </div>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Grand Total</span>
                <span className={styles.totalVal}>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer title="LUXE" links={FOOTER_LINKS} />

      <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
        <button type="button" className={styles.mobileNavBtn} onClick={() => navigate("/")}>
          <i className="fa-solid fa-house" aria-hidden="true" />
          <span>Home</span>
        </button>
        <button type="button" className={styles.mobileNavBtn} onClick={() => navigate("/products")}>
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <span>Catalog</span>
        </button>
        <button type="button" className={styles.mobileNavBtn} onClick={openWishlist}>
          <i className="fa-regular fa-heart" aria-hidden="true" />
          {wishlistCount > 0 && <span className={styles.navDot} />}
          <span>Wishlist</span>
        </button>
        <button type="button" className={`${styles.mobileNavBtn} ${styles.mobileNavBtnActive}`} onClick={openCart}>
          <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
          <span>Bag</span>
        </button>
      </nav>
    </div>
  );
}

export default CheckoutScreen;
