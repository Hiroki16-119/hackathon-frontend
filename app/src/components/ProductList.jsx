import ProductCard from "./ProductCard";
import ProductActions from "./ProductActions";

export default function ProductList({ products, isOwn, onUpdated, user, onPurchased }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product.id} className="relative">
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            isPurchased={product.is_purchased} // ←ここを修正
            user={user}
            onPurchased={onPurchased}
            seller_id={product.seller_id }
          />
          {isOwn && (
            <ProductActions product={product} onUpdated={onUpdated} />
          )}
        </div>
      ))}
    </div>
  );
}
