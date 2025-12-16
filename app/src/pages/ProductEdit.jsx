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
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setPrice(data.price || "");
          setDescription(data.description || "");
        }
      } catch (err) {
        console.error("fetchProduct error:", err);
      }
    };
    fetchProduct();
  }, [id, API_BASE_URL]);

  // 編集保存
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), description }),
      });
      if (res.ok) {
        alert("更新しました");
        navigate("/mypage");
      } else {
        const txt = await res.text().catch(() => "");
        console.error("update failed:", res.status, txt);
        alert("更新に失敗しました");
      }
    } catch (err) {
      console.error("update error:", err);
      alert("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ position: "relative", zIndex: 99999, isolation: "isolate" }}
    >
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/35 rounded-2xl p-6 backdrop-blur-md border border-white/6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 flex items-center justify-center text-xl font-bold text-black shadow-neon">
              ✦
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-300">
                商品編集
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                出品中の商品情報を更新します
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <div className="text-sm text-slate-200 mb-2">商品名</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="例: レトロスピーカー"
                required
              />
            </label>

            <label className="block">
              <div className="text-sm text-slate-200 mb-2">価格（円）</div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-md px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="例: 2500"
                required
              />
            </label>

            <label className="block">
              <div className="text-sm text-slate-200 mb-2">説明</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md px-4 py-3 bg-white/5 border border-white/6 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                rows={6}
                placeholder="商品の状態や特徴を詳しく入力してください"
              />
            </label>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 text-black font-semibold hover:scale-[1.02] transition-shadow shadow-[0_10px_30px_rgba(99,102,241,0.12)]"
              >
                {loading ? "保存中..." : "保存する"}
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

        <div className="mt-6 text-center text-sm text-slate-400">
          変更は即時反映されます。
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