import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home({ products: initialProducts, user, fetchProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [loadingSort, setLoadingSort] = useState(false);
  const [showOnlyUnpurchased, setShowOnlyUnpurchased] = useState(false);
  const [sortedByProb, setSortedByProb] = useState(false); // 追加: 並び替え状態

  useEffect(() => {
    setProducts(initialProducts || []);
    setSortedByProb(false); // 初期化
  }, [initialProducts]);

  const filteredProducts = showOnlyUnpurchased
    ? products.filter(p => !p.is_purchased && !p.isPurchased)
    : products;

  // 並べ替え（購入確率）を実行
  const handleSortByProbability = async () => {
    if (!user) {
      alert("ログインしてください");
      return;
    }

    setLoadingSort(true);
    try {
      const payload = {
        user_id: user.uid,
        products: (filteredProducts || products).map(p => ({
          product_id: p.id || p.product_id,
          category_code: p.category || p.category_code || "",
          price: p.price || 0
        }))
      };
      const headers = { "Content-Type": "application/json" };
      if (user.token) headers.Authorization = `Bearer ${user.token}`;

      const res = await fetch(`${API_BASE_URL}/predict_batch`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        console.error("predict_batch failed", await res.text());
        alert("推薦の取得に失敗しました");
        return;
      }
      const data = await res.json();
      const orderMap = new Map(data.results.map((r, i) => [r.product_id, i]));
      const sorted = [...products].sort((a, b) => {
        const ia = orderMap.has(a.id) ? orderMap.get(a.id) : Number.MAX_SAFE_INTEGER;
        const ib = orderMap.has(b.id) ? orderMap.get(b.id) : Number.MAX_SAFE_INTEGER;
        return ia - ib;
      });
      setProducts(sorted);
      setSortedByProb(true); // 成功したら状態を true に
    } catch (err) {
      console.error(err);
      alert("推薦の取得中にエラーが発生しました");
      setSortedByProb(false);
    } finally {
      setLoadingSort(false);
    }
  };

  // デフォルト順に戻す
  const handleResetDefault = () => {
    setProducts(initialProducts || []);
    setSortedByProb(false); // デフォルト状態に
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">人気の商品</h2>

      <div className="mb-4 flex items-center space-x-3">
        <button
          className={`px-4 py-2 rounded ${!showOnlyUnpurchased ? "bg-blue-600 text-white" : "bg-gray-200"}`}
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

        <div className="ml-auto flex gap-2">
          <button
            onClick={handleSortByProbability}
            className={`px-3 py-1 rounded ${sortedByProb ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            disabled={loadingSort}
          >
            購入確率で並べ替え
          </button>
          <button
            onClick={handleResetDefault}
            className={`px-3 py-1 rounded ${!sortedByProb ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            デフォルト
          </button>
        </div>
      </div>

      <ProductList
        products={filteredProducts}
        user={user}
        onPurchased={fetchProducts}
      />
    </div>
  );
}


