import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 商品情報を取得
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name || "");
        setPrice(data.price || "");
        setDescription(data.description || "");
      }
    };
    fetchProduct();
  }, [id, API_BASE_URL]);

  // 編集保存
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), description }),
    });
    setLoading(false);
    if (res.ok) {
      alert("更新しました");
      navigate("/mypage");
    } else {
      alert("更新に失敗しました");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">商品編集</h2>
        <label className="block mb-2 font-semibold">商品名</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        />
        <label className="block mb-2 font-semibold">価格</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        />
        <label className="block mb-2 font-semibold">説明</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-3 rounded w-full mb-6"
          rows={5}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 px-6 rounded w-full hover:bg-blue-700 text-lg"
        >
          {loading ? "保存中..." : "保存"}
        </button>
      </form>
    </div>
  );
}