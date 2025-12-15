import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      }
    };
    fetchProduct();
  }, [id, API_BASE_URL]);

  if (!product) return <div>読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-64 object-cover mb-4"
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
