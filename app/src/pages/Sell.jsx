import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateDescription } from "../api/openai";
import { getAuth } from "firebase/auth";

export default function Sell({ onProductAdded, user }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userHint, setUserHint] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleGenerateDescription = async () => {
    if (!name) {
      alert("先に商品名を入力してください！");
      return;
    }
    setLoadingDesc(true);
    try {
      const desc = await generateDescription(name, userHint);
      setDescription(desc);
    } catch (err) {
      console.error(err);
      alert("説明生成に失敗しました。");
    } finally {
      setLoadingDesc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !category) {
      alert("商品名・価格・カテゴリーは必須です！");
      return;
    }

    setSubmitting(true);
    // 最新の Firebase ID token を取得（強制更新）
    let token = user?.token || null;
    try {
      const auth = getAuth();
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken(true);
      }
    } catch (err) {
      console.warn("getIdToken error:", err);
    }

    const newProduct = {
      name,
      price: Number(price),
      category,
      description,
      imageUrl,
      seller_id: user?.uid,
      seller_name: user?.displayName,
      isPurchased: false,
    };

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers,
        body: JSON.stringify(newProduct),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      console.log("response status:", res.status, data);

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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/35 rounded-2xl p-8 backdrop-blur-md border border-white/6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 flex items-center justify-center text-xl font-bold text-black shadow-neon">
              ✦
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-300">
                新規出品
              </h2>
              <p className="text-sm text-slate-300 mt-1">魅力的な説明と正しいカテゴリで目立たせましょう</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm text-slate-200 mb-2">商品名</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="例：ビンテージスニーカー"
                  required
                />
              </label>

              <label className="block">
                <div className="text-sm text-slate-200 mb-2">価格（円）</div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="例：2500"
                  required
                />
              </label>
            </div>

            <label className="block">
              <div className="text-sm text-slate-200 mb-2">カテゴリー</div>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="例：家電, 本, ファッション"
                required
              />
            </label>

            <div>
              <label className="block mb-2 text-sm text-slate-200">紹介文の自動生成（任意）</label>
              <div className="flex gap-3">
                <input
                  value={userHint}
                  onChange={(e) => setUserHint(e.target.value)}
                  className="flex-1 rounded-lg px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="例：新品同様・未使用・限定モデル"
                />
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={loadingDesc}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    loadingDesc
                      ? "bg-gray-500 text-black"
                      : "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.12)]"
                  }`}
                >
                  {loadingDesc ? "生成中..." : "説明を生成"}
                </button>
              </div>
            </div>

            <label className="block">
              <div className="text-sm text-slate-200 mb-2">商品の説明</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                rows={6}
                placeholder="商品の状態や特徴、配送方法などを詳しく記載してください"
              />
            </label>

            <label className="block">
              <div className="text-sm text-slate-200 mb-2">画像URL（任意）</div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="例：https://example.com/image.jpg"
              />
            </label>

            {imageUrl && (
              <div className="rounded-lg overflow-hidden border border-white/6">
                <img src={imageUrl} alt="preview" className="w-full h-48 object-cover" />
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 text-black font-semibold hover:scale-[1.02] transition-shadow"
              >
                {submitting ? "出品中..." : "出品する"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-3 rounded-full bg-white/5 text-slate-200 border border-white/6 hover:bg-white/8"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-sm text-slate-400">
          Tip: 正確なカテゴリーと鮮明な画像で目に留まりやすくなります。
        </div>
      </div>

      <style>{`
        .shadow-neon {
          box-shadow: 0 10px 30px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.03);
        }
      `}</style>
    </div>
  );
}
