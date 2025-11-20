import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetail({ products }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.id === id);
      setProduct(found || null);
    }
  }, [id, products]);

  // ✅ productsがまだ読み込まれていない場合
  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-500 text-lg">読み込み中です...</p>
      </div>
    );
  }

  // ✅ 商品が存在しない場合
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-500 text-lg">商品が見つかりません。</p>
        <Link to="/" className="text-blue-600 hover:underline">
          商品一覧に戻る
        </Link>
      </div>
    );
  }

  // ✅ 商品が見つかった場合
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-80 object-cover rounded-lg shadow-md mb-6"
      />
      <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
      <p className="text-xl text-blue-600 font-semibold mb-4">
        ¥{product.price.toLocaleString()}
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {product.description}
      </p>

      <Link
        to="/"
        className="inline-block mt-6 text-blue-600 hover:underline font-medium"
      >
        ← 商品一覧に戻る
      </Link>
    </div>
  );
}
