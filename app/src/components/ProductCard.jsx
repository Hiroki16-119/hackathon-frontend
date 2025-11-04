import { Link } from "react-router-dom";

export default function ProductCard({ id, name, price, imageUrl }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* ✅ 商品画像＋名前はリンク */}
      <Link to={`/product/${id}`} className="flex-1">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
            {name}
          </h3>
          <p className="text-gray-600 mt-1">¥{price.toLocaleString()}</p>
        </div>
      </Link>

      {/* ✅ 購入ボタン（リンク外） */}
      <div className="px-4 pb-4">
        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          購入する
        </button>
      </div>
    </div>
  );
}

