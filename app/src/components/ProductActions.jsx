import { useNavigate } from "react-router-dom";

export default function ProductActions({ product, onUpdated }) {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // 削除
  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    const res = await fetch(`${API_BASE_URL}/products/${product.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      if (onUpdated) onUpdated();
    } else {
      alert("削除に失敗しました");
    }
  };

  return (
    <div className="absolute top-2 right-2 flex gap-2">
      <button
        className="bg-yellow-200 px-2 py-1 rounded text-xs"
        onClick={() => navigate(`/products/${product.id}/edit`)}
      >
        編集
      </button>
      <button
        className="bg-red-200 px-2 py-1 rounded text-xs"
        onClick={handleDelete}
      >
        削除
      </button>
    </div>
  );
}