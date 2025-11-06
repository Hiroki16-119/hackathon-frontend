import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ id, name, price, imageUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 商品カード */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
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

        <div className="px-4 pb-4">
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            購入する
          </button>
        </div>
      </div>

      {/* ✅ モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-xl font-semibold mb-2">購入確認</h3>
            <p className="text-gray-700 mb-4">
              「<span className="font-semibold">{name}</span>」を<br />
              ¥{price.toLocaleString()} で購入しますか？
            </p>
            <div className="flex justify-between gap-3">
              <button
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                キャンセル
              </button>
              <button
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                onClick={() => {
                  alert(`「${name}」を購入しました！`);
                  setIsModalOpen(false);
                }}
              >
                購入する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

