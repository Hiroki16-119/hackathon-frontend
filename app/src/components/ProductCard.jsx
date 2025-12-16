import React, { useState } from "react";
import { Link } from "react-router-dom";

function ProductCardInner({
  id,
  name,
  price,
  imageUrl,
  isPurchased,
  user,
  onPurchased,
  seller_id,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const isMine = Boolean(user && seller_id && seller_id === user.uid);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (user?.token) headers.Authorization = `Bearer ${user.token}`;
      const res = await fetch(`${API_BASE_URL}/products/${id}/purchase`, {
        method: "POST",
        headers,
      });
      if (res.ok) {
        alert(`「${name}」を購入しました！`);
        if (onPurchased) onPurchased();
      } else {
        alert("購入に失敗しました");
      }
    } catch (e) {
      alert("通信エラーが発生しました");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("本当にこの商品を削除しますか？")) return;
    setLoading(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (user?.token) headers.Authorization = `Bearer ${user.token}`;
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        alert("商品を削除しました");
        if (onPurchased) onPurchased(); // リスト更新用コールバック流用
      } else {
        const text = await res.text();
        console.error("delete failed:", res.status, text);
        alert("削除に失敗しました");
      }
    } catch (e) {
      console.error(e);
      alert("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-gradient-to-r from-indigo-900/40 to-violet-900/35 rounded-lg overflow-hidden flex flex-col border border-white/6 shadow-lg ${
        isMine ? "ring-2 ring-yellow-400" : ""
      }`}
      style={{ backdropFilter: "blur(6px)" }}
    >
      <Link
        to={`/products/${id}`}
        className="block hover:opacity-90 transition"
      >
        <img
          src={imageUrl}
          alt={name}
          loading="lazy" // ← 遅延読み込み
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between">
            {/* 名前・価格は白のままで見やすく */}
            <h3 className="text-lg font-semibold text-white" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
              {name}
            </h3>
            <p className="mt-1 font-semibold text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
              ¥{Number(price).toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        {isMine ? (
          <div className="flex gap-3">
            <Link
              to={`/products/${id}/edit`}
              className="flex-1 py-2 rounded-md text-center font-medium transition transform hover:scale-[1.01] bg-gradient-to-r from-green-400 to-green-600 text-black shadow-[0_8px_20px_rgba(16,185,129,0.12)]"
            >
              編集
            </Link>
            <button
              className="flex-1 py-2 rounded-md font-medium transition transform hover:scale-[1.01] bg-gradient-to-r from-red-400 to-red-600 text-white shadow-[0_8px_20px_rgba(239,68,68,0.12)]"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "処理中..." : "削除"}
            </button>
          </div>
        ) : isPurchased ? (
          <button
            className="w-full bg-gray-400 text-white py-2 rounded-md cursor-not-allowed"
            disabled
          >
            購入済み
          </button>
        ) : (
          <button
            className="w-full py-2 rounded-md font-semibold transition transform hover:scale-[1.01] bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_10px_30px_rgba(56,189,248,0.12)]"
            onClick={() => setIsModalOpen(true)}
            aria-label={`購入: ${name}`}
          >
            購入する
          </button>
        )}
      </div>

      {/* モーダル */}
      {!isMine && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gradient-to-b from-slate-900/90 to-black rounded-lg shadow-xl p-6 w-80 text-center border border-white/6">
            <h3 className="text-xl font-semibold mb-2 text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
              購入確認
            </h3>
            <p className="text-white/90 mb-4" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              「<span className="font-semibold">{name}</span>」を
              <br />
              ¥{Number(price).toLocaleString()} で購入しますか？
            </p>
            <div className="flex justify-between gap-3">
              <button
                className="flex-1 bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                className="flex-1 bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600"
                onClick={handlePurchase}
                disabled={loading}
              >
                {loading ? "購入中..." : "購入する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(ProductCardInner);

