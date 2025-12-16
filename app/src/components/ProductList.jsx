import React from "react";
import ProductCard from "./ProductCard";

function ProductList({ products = [], user, onPurchased }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((p) => (
        <ProductCard
          key={p.id ?? p.product_id}
          id={p.id ?? p.product_id}
          name={p.name}
          price={p.price}
          imageUrl={p.imageUrl ?? p.image_url}
          isPurchased={p.isPurchased ?? p.is_purchased}
          user={user}
          onPurchased={onPurchased}
          seller_id={p.seller_id ?? p.seller?.id}
        />
      ))}
    </div>
  );
}

export default React.memo(ProductList);
