import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import authFetch from "../lib/authFetch"; // 既に作成済みなら使う（無ければ通常 fetch のまま）

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const PLACEHOLDER_DATA_URL =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='320' role='img' aria-label='No image'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial, Helvetica, sans-serif' font-size='22'>Not image</text></svg>`
    );

  const resolveImageUrl = (img) => {
    // 画像が無ければネットワークリクエストを発生させずにインラインSVGを返す
    if (!img) return PLACEHOLDER_DATA_URL;
    if (typeof img !== "string") return PLACEHOLDER_DATA_URL;
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) return img;
    const base = (API_BASE_URL || window.location.origin).replace(/\/$/, "");
    return img.startsWith("/") ? `${base}${img}` : `${base}/${img}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // authFetch を使えるなら使って認証状態に応じた呼び出しを行う
        const res = await (typeof authFetch === "function"
          ? authFetch(`/products/${id}`, { method: "GET" }, { requireAuth: false })
          : fetch(`${API_BASE_URL}/products/${id}`));

        if (res.status === 403) {
          setError("この商品の閲覧には認証が必要です。ログインしてください。");
          return;
        }
        if (res.status === 404) {
          setError("商品が見つかりませんでした。");
          return;
        }
        if (!res.ok) {
          const txt = await res.text();
          setError(`商品の取得に失敗しました (${res.status})`);
          console.error("ProductDetail fetch failed:", res.status, txt);
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("ProductDetail fetch error:", err);
        setError("ネットワークエラーで商品情報を取得できませんでした。");
      }
    };
    fetchProduct();
  }, [id, API_BASE_URL]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 relative z-20 text-red-400">
        エラー: {error}
        <div className="mt-4">
          <Link to="/login" className="text-blue-400 underline">ログインする</Link>{" "}
          または <Link to="/" className="text-blue-400 underline">一覧に戻る</Link>
        </div>
      </div>
    );
  }
  if (!product) return <div className="relative z-20">読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 relative z-20">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={resolveImageUrl(product.imageUrl ?? product.image_url)}
        alt={product.name}
        className="w-full h-64 object-cover mb-4"
        loading="lazy"
        onError={(e) => {
          if (!e.currentTarget.dataset.fallback) {
            e.currentTarget.dataset.fallback = "1";
            e.currentTarget.src = PLACEHOLDER_DATA_URL;
          }
        }}
      />
      <div className="mb-2">価格: {product.price}円</div>
      {/* カテゴリーを表示 */}
      <div className="mb-2">カテゴリー: {product.category || "未設定"}</div>
      <div className="mb-2">説明: {product.description}</div>
      {/* ここで出品者名を表示 */}
      <div className="mb-2 text-gray-700">
        出品者: {product.seller?.name || product.seller_name || "不明"}
      </div>

      <Link
        to="/"
        className="inline-block mt-6 text-blue-600 hover:underline font-medium"
      >
        ← 商品一覧に戻る
      </Link>
    </div>
  );
}
