import styles from "./ProductCard.module.css";
import RatingStars from "../RatingStars/RatingStars";
import PriceTag from "../PriceTag/PriceTag";
import ProductBadge from "../ProductBadge/ProductBadge";
import WishlistButton from "../WishlistButton/WishlistButton";

function ProductCard({ product, onWishlist, onQuickAdd }) {
  const image = product?.thumbnail || product?.images?.[0];
  return (
    <article
      className={styles.card}
      aria-label={product?.title || "Product card"}
    >
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={image}
          alt={product?.title || "Product"}
        />
        {product?.images?.[1] ? (
          <img className={styles.imageHover} src={product.images[1]} alt="" />
        ) : null}
        <div className={styles.badgeRow}>
          {product?.featured ? (
            <ProductBadge tone="featured">Featured</ProductBadge>
          ) : null}
          {product?.limitedEdition ? (
            <ProductBadge tone="limited">Limited</ProductBadge>
          ) : null}
          {product?.bestSeller ? (
            <ProductBadge tone="bestseller">Bestseller</ProductBadge>
          ) : null}
        </div>
        <WishlistButton
          onClick={onWishlist}
          ariaLabel={`Save ${product?.title || "product"}`}
        />
      </div>
      <div className={styles.content}>
        <p className={styles.brand}>{product?.brand}</p>
        <h3 className={styles.title}>{product?.title}</h3>
        <p className={styles.description}>{product?.shortDescription}</p>
        <div className={styles.metaRow}>
          <RatingStars
            rating={product?.rating || 0}
            reviewCount={product?.reviewCount || 0}
          />
          <PriceTag
            price={product?.price}
            originalPrice={product?.originalPrice}
          />
        </div>
        <button type="button" className={styles.quickAdd} onClick={onQuickAdd}>
          Quick add
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
