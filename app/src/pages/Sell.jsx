import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sell({ addProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState(""); // ✅ 追加
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("商品名と価格は必須です！");
      return;
    }

    const newProduct = {
      name,
      price: Number(price),
      description, 
      imageUrl: imageUrl || "https://placehold.co/400x300",
    };

    addProduct(newProduct);
    navigate("/"); // 出品後はトップページに戻る
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">商品を出品する</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 商品名 */}
        <div>
          <label className="block font-medium mb-2">商品名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="例：古着ジャケット"
            required
          />
        </div>

        {/* 価格 */}
        <div>
          <label className="block font-medium mb-2">価格（円）</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="例：2500"
            required
          />
        </div>

        {/* ✅ 商品説明 */}
        <div>
          <label className="block font-medium mb-2">商品の説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            rows="4"
            placeholder="商品の状態や特徴を詳しく書いてください"
          />
        </div>

        {/* 画像URL */}
        <div>
          <label className="block font-medium mb-2">画像URL（任意）</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="例：https://example.com/image.jpg"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          出品する
        </button>
      </form>
    </div>
  );
}
