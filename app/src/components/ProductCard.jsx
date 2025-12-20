import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authFetch from "../lib/authFetch";

function ProductCard({
  id,
  name,
  price,
  imageUrl,
  seller_id,
  user,
  ...props
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // 購入済フラグは複数形態を許容して解決
  const isPurchased = Boolean(props.isPurchased ?? props.is_purchased ?? props.purchased ?? false);
  // 商品削除ハンドラ（オーナー用）
  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;
    setLoading(true);
    try {
      const res = await authFetch(`/products/${id}`, { method: "DELETE" }, { requireAuth: true });
      if (res.status === 401) {
        alert("ログインが必要です。ログインページへ移動します。");
        navigate("/login");
        return;
      }
      if (!res.ok) {
        const txt = await res.text();
        console.error("delete failed:", res.status, txt);
        alert("削除に失敗しました");
        return;
      }
      alert("削除しました");
      navigate("/");
    } catch (err) {
      console.error("delete error:", err);
      alert("削除中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // シンプルなインラインSVGをフォールバックにして 404 を防ぐ
  const PLACEHOLDER_DATA_URL =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='320'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial, Helvetica, sans-serif' font-size='20'>No image</text></svg>`
    );

  const isMine = Boolean(user && seller_id && seller_id === user.uid);
  // 画像URL解決ヘルパー：絶対URL / data: はそのまま、相対パスなら API_BASE_URL を付与
  const resolveImageUrl = (img) => {
    if (!img) return PLACEHOLDER_DATA_URL;
    if (typeof img !== "string") return PLACEHOLDER_DATA_URL;
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) return img;
    const base = (API_BASE_URL || window.location.origin).replace(/\/$/, "");
    return img.startsWith("/") ? `${base}${img}` : `${base}/${img}`;
  };

  const handlePurchase = async () => {
    if (!confirm("本当に購入しますか？")) return;
    setLoading(true);
    try {
      const res = await authFetch(`/products/${id}/purchase`, { method: "POST" }, { requireAuth: true });

      if (res.status === 401) {
        alert("ログインが必要です。ログインページへ移動します。");
        navigate("/login");
        return;
      }
      if (!res.ok) {
        const txt = await res.text();
        console.error("purchase failed:", res.status, txt);
        alert("購入に失敗しました");
        return;
      }
      alert("購入しました");
      // モーダルを閉じて UI を安定させる
      setIsModalOpen(false);
      // 必要なら親へ更新通知を送る（props.onPurchased など）
      if (typeof props.onPurchased === "function") props.onPurchased(id);
    } catch (err) {
      console.error("purchase error:", err);
      alert("購入中にエラーが発生しました");
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
          src={resolveImageUrl(imageUrl)}
          alt={name}
          loading="lazy"
          className="w-full h-48 object-cover"
          onError={(e) => {
            // ループ防止：一度だけ data-url に切り替える
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = "1";
              e.currentTarget.src = PLACEHOLDER_DATA_URL;
            }
          }}
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
            売り切れ
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

export default React.memo(ProductCard);

