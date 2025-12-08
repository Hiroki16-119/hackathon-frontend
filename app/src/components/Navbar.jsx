import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* 左側ロゴ */}
        <Link 
          to="/" 
          className="text-2xl font-bold !text-pink-500 no-underline hover:!text-pink-400 transition"
        >
          NextGen Flea
        </Link>

        {/* 右側メニュー */}
        <div className="flex items-center space-x-4">
          {/* ✅ ホームと出品をそれぞれ枠で囲む */}
          <Link
            to="/"
            className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 transition"
          >
            ホーム
          </Link>

          <Link
            to="/sell"
            className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 transition"
          >
            出品
          </Link>

          {/* マイページへのリンク（ログイン時のみ表示） */}
          {user && (
            <Link
              to="/mypage"
              className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 transition"
            >
              マイページ
            </Link>
          )}

          {/* ✅ ログイン or ログアウト */}
          {user ? (
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              ログアウト
            </button>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">
              ログイン
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
