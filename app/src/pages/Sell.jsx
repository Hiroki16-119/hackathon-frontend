import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateDescription } from "../api/openai"; // ✅ import追加

export default function Sell({ onProductAdded, user }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userHint, setUserHint] = useState(""); // ✅ ユーザー補足情報
  const [loadingDesc, setLoadingDesc] = useState(false);
  const navigate = useNavigate();

    // ✅ 環境変数からAPIのベースURLを取得
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // ✅ ChatGPT APIで説明を生成
  const handleGenerateDescription = async () => {
    if (!name) {
      alert("先に商品名を入力してください！");
      return;
    }

    setLoadingDesc(true);
    try {
      // ✅ userHintも一緒に送信
      const desc = await generateDescription(name, userHint);
      setDescription(desc);
    } catch (err) {
      console.error(err);
      alert("ChatGPTによる説明生成に失敗しました。");
    } finally {
      setLoadingDesc(false);
    }
  };

  // ✅ 出品処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("商品名と価格は必須です！");
      return;
    }


    const newProduct = {
      name,
      price: Number(price),
      description,
      imageUrl,
      seller_id: user?.id,
      seller_name: user?.name,
      isPurchased: false, // 新規出品時は未購入
};

    try {
      const headers = { "Content-Type": "application/json" };
      if (user?.token) headers.Authorization = `Bearer ${user.token}`;

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers,
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Backend error:", data);
        alert("出品に失敗しました");
        return;
      }

      alert("✅ 商品を出品しました！");
      onProductAdded();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("商品の出品に失敗しました。");
    }
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

        {/* ✅ ChatGPTへの補足情報 */}
        <div>
          <label className="block font-medium mb-2">紹介文の自動生成を使う方へ、補足情報（任意）</label>
          <textarea
            value={userHint}
            onChange={(e) => setUserHint(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            rows="2"
            placeholder="例：新品未使用・コットン素材・ナチュラルカラー"
          />
        </div>

        {/* 商品説明 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium">商品の説明</label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={loadingDesc}
              className={`text-sm px-3 py-1 rounded-md transition ${
                loadingDesc
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {loadingDesc ? "生成中..." : "説明を自動生成"}
            </button>
          </div>
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

        {/* 出品ボタン */}
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
