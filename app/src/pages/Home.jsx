import { useState, useEffect, useMemo, useCallback } from "react";
import ProductList from "../components/ProductList";
import React from "react";
import Logo from "../components/Logo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home({ products: initialProducts, user, fetchProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [loadingSort, setLoadingSort] = useState(false);
  const [showOnlyUnpurchased, setShowOnlyUnpurchased] = useState(false);
  const [sortedByProb, setSortedByProb] = useState(false);

  useEffect(() => {
    setProducts(initialProducts || []);
    setSortedByProb(false);
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return showOnlyUnpurchased
      ? products.filter(p => !p.is_purchased && !p.isPurchased)
      : products;
  }, [products, showOnlyUnpurchased]);

  const handleSortByProbability = useCallback(async () => {
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
      setSortedByProb(true);
    } catch (err) {
      console.error(err);
      alert("推薦の取得中にエラーが発生しました");
      setSortedByProb(false);
    } finally {
      setLoadingSort(false);
    }
  }, [user, filteredProducts, products]);

  const handleResetDefault = useCallback(() => {
    setProducts(initialProducts || []);
    setSortedByProb(false);
  }, [initialProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900/60 via-indigo-800/40 to-violet-900/60 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-20">
        {/* ヘッダー */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Logo size={40} />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">NextGen Flea</span>
            </h1>
            <p className="text-sm text-white/85 mt-1">近未来のフリマ — あなたに最適な商品をレコメンド</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-400 mr-2">表示</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOnlyUnpurchased(false)}
                className={`px-3 py-1 rounded-md text-sm transition ${
                  !showOnlyUnpurchased
                    ? "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.18)]"
                    : "bg-white/5 text-slate200"
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setShowOnlyUnpurchased(true)}
                className={`px-3 py-1 rounded-md text-sm transition ${
                  showOnlyUnpurchased
                    ? "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.18)]"
                    : "bg-white/5 text-slate200"
                }`}
              >
                未購入のみ
              </button>
            </div>
          </div>
        </header>

        {/* メインコンテナ（ガラスモーフィズム） */}
        <main className="bg-gradient-to-r from-indigo-900/50 to-violet-900/40 rounded-2xl p-6 backdrop-blur-md border border-white/6 shadow-lg">
          {/* コントロールバー */}
          <div className="mb-6 flex items-center">
            <div className="text-lg font-medium text-slate-200">商品一覧</div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={handleSortByProbability}
                disabled={loadingSort}
                className={`px-4 py-2 rounded-full text-sm font-medium transition transform ${
                  sortedByProb
                    ? "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.18)]"
                    : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {loadingSort ? "並べ替え中..." : "購入確率で並べ替え"}
              </button>

              <button
                onClick={handleResetDefault}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  !sortedByProb
                    ? "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.18)]"
                    : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                デフォルト
              </button>
            </div>
          </div>

          {/* 商品リスト */}
          <div className="mt-4">
            <ProductList
              products={filteredProducts}
              user={user}
              onPurchased={fetchProducts}
            />
          </div>
        </main>

        {/* footer accent */}
        <footer className="mt-8 text-center text-xs text-slate-500">
          <div className="inline-block px-3 py-1 rounded-full bg-white/3 border border-white/6">
            AI レコメンドによるパーソナライズ表示
          </div>
        </footer>
      </div>

    </div>
  );
}


