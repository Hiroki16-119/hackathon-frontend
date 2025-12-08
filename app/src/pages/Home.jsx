import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";

export default function Home({ products, user, fetchProducts }) {
  // fetchProductsはApp.jsxから渡す（商品一覧再取得用）

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">人気の商品</h2>
      <ProductList
        products={products}
        user={user}
        onPurchased={fetchProducts}
      />
    </div>
  );
}


