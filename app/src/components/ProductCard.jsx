import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  isPurchased,
  user,
  onPurchased,
  seller_id, // ← 追加: レンダリング側で渡す
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
      className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col border ${
        isMine ? "border-yellow-400" : "border-transparent"
      }`}
    >
      <Link to={`/products/${id}`} className="block hover:opacity-80 transition">
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            {isMine && (
              <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">自分の商品</span>
            )}
          </div>
          <p className="text-gray-600 mt-1">¥{Number(price).toLocaleString()}</p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        {isMine ? (
          <div className="flex gap-3">
            <Link
              to={`/products/${id}/edit`}
              className="flex-1 bg-green-600 text-white py-2 rounded-md text-center hover:bg-green-700"
            >
              編集
            </Link>
            <button
              className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            購入する
          </button>
        )}
      </div>

      {/* モーダル */}
      {!isMine && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-xl font-semibold mb-2">購入確認</h3>
            <p className="text-gray-700 mb-4">
              「<span className="font-semibold">{name}</span>」を<br />
              ¥{Number(price).toLocaleString()} で購入しますか？
            </p>
            <div className="flex justify-between gap-3">
              <button
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
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

