import { useState } from "react";
import ProductList from "../components/ProductList";

export default function Home({ products, user, fetchProducts }) {
  const [showOnlyUnpurchased, setShowOnlyUnpurchased] = useState(false);

  // 未購入商品のみ抽出
  const filteredProducts = showOnlyUnpurchased
    ? products.filter(p => !p.is_purchased)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">人気の商品</h2>
      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded mr-2 ${!showOnlyUnpurchased ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setShowOnlyUnpurchased(false)}
        >
          すべて表示
        </button>
        <button
          className={`px-4 py-2 rounded ${showOnlyUnpurchased ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setShowOnlyUnpurchased(true)}
        >
          未購入のみ表示
        </button>
      </div>
      <ProductList
        products={filteredProducts}
        user={user}
        onPurchased={fetchProducts}
      />
    </div>
  );
}


