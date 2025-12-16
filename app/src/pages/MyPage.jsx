import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";

export default function MyPage({ user }) {
  const params = useParams();
  const [userId, setUserId] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]); // 購入履歴
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // userIdを決定
  useEffect(() => {
    if (params.id) {
      setUserId(params.id);
    } else if (user?.uid) {
      setUserId(user.uid);
    }
  }, [params.id, user]);

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // プロフィール取得
      const pRes = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/users/${userId}`);
      if (pRes.ok) setProfile(await pRes.json().catch(() => null));

      // 出品商品取得
      const res = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/users/${userId}/products`);
      if (!res.ok) throw new Error(`商品取得失敗 HTTP ${res.status}`);
      setProducts(await res.json().catch(() => []));

      // 購入履歴取得
      const purRes = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/users/${userId}/purchases`);
      if (purRes.ok) {
        setPurchasedProducts(await purRes.json().catch(() => []));
      }
    } catch (err) {
      console.error("MyPage fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !API_BASE_URL) return;
    fetchData();
    // eslint-disable-next-line
  }, [userId, API_BASE_URL]);

  const isOwn = String(userId) === String(user?.uid);

  const initials = (profile?.name || "").split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-indigo-900/50 to-violet-900/40 rounded-2xl p-6 backdrop-blur-md border border-white/6 shadow-lg">
          {/* ユーザーヘッダー */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-black bg-gradient-to-r from-cyan-300 to-violet-400 shadow-neon">
              {initials || "U"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-300">
                {profile?.name || "ユーザー名未設定"}
              </h1>
              <p className="text-sm text-slate-300 mt-1">{profile?.email || "メール未設定"}</p>

              <div className="mt-3 flex items-center gap-3">
                <div className="text-xs text-slate-300">出品数</div>
                <div className="px-3 py-1 rounded-full bg-white/6 text-sm">{products.length}</div>

                <div className="text-xs text-slate-300 ml-4">購入履歴</div>
                <div className="px-3 py-1 rounded-full bg-white/6 text-sm">{purchasedProducts.length}</div>
              </div>
            </div>

            <div>
              {isOwn ? (
                <Link
                  to={`/users/${user.uid}/edit`}
                  className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 text-black font-medium hover:brightness-95"
                >
                  プロフィール編集
                </Link>
              ) : null}
            </div>
          </div>

          {/* タブ風コントロール */}
          <div className="mt-6 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <Link
                to="/sell"
                className="px-3 py-1 rounded-md text-sm bg-white/5 text-slate-200 hover:bg-white/10"
              >
                新しく出品する
              </Link>
            </div>
          </div>
        </div>

        {/* コンテンツ領域 */}
        <div className="mt-8 grid grid-cols-1 gap-8">
          {/* 出品商品 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">出品商品</h2>
            <div className="bg-white/3 backdrop-blur-sm border border-white/6 rounded-xl p-4">
              {loading ? (
                <div className="py-8 text-center text-slate-300">読み込み中...</div>
              ) : products.length === 0 ? (
                <div className="py-8 text-center text-slate-400">出品した商品はありません。</div>
              ) : (
                <ProductList
                  products={products}
                  isOwn={isOwn}
                  onUpdated={fetchData}
                  user={user}
                />
              )}
            </div>
          </section>

          {/* 購入履歴 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">購入履歴</h2>
            <div className="bg-white/3 backdrop-blur-sm border border-white/6 rounded-xl p-4">
              {loading ? (
                <div className="py-8 text-center text-slate-300">読み込み中...</div>
              ) : purchasedProducts.length === 0 ? (
                <div className="py-8 text-center text-slate-400">購入した商品はありません。</div>
              ) : (
                <ProductList products={purchasedProducts} isOwn={false} user={user} />
              )}
            </div>
          </section>
        </div>

      </div>

      <style>{`
        .shadow-neon {
          box-shadow: 0 8px 30px rgba(99,102,241,0.12);
        }
      `}</style>
    </div>
  );
}