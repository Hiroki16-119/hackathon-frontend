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

  console.log("user:", user, "userId:", userId); // ← 追加

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>

      <section className="mb-6">
        <h2 className="font-medium">ユーザー情報</h2>
        <div className="mt-2 text-sm text-gray-700">
          <div>名前: {profile?.name || "未設定"}</div>
          <div>メール: {profile?.email || "未設定"}</div>
        </div>
        {/* 編集ボタンを追加 */}
        {user && (
          <Link
            to={`/users/${user.uid}/edit`}
            className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ユーザー情報を編集
          </Link>
        )}
      </section>

      {/* 出品商品 */}
      <section>
        <h2 className="font-medium mb-2">出品商品</h2>
        {loading ? (
          <div>読み込み中...</div>
        ) : products.length === 0 ? (
          <div className="text-gray-500">出品した商品はありません。</div>
        ) : (
          <ProductList
            products={products}
            isOwn={String(userId) === String(user?.uid)} // ← 修正
            onUpdated={fetchData}
            user={user}
          />
        )}
      </section>

      {/* 購入履歴 */}
      <section className="mt-8">
        <h2 className="font-medium mb-2">購入した商品</h2>
        {loading ? (
          <div>読み込み中...</div>
        ) : purchasedProducts.length === 0 ? (
          <div className="text-gray-500">購入した商品はありません。</div>
        ) : (
          <ProductList products={purchasedProducts} isOwn={false} user={user} />
        )}
      </section>
    </div>
  );
}