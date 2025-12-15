import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="w-full flex justify-between items-center px-8 py-4">
        {/* 左側ロゴ */}
        <Link 
          to="/" 
          className="text-2xl font-bold text-yellow-500 no-underline hover:text-yellow-400 transition"
        >
          NextGen Flea
        </Link>
        {/* 右側メニュー */}
        <div className="flex items-center space-x-4">
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
          {user && (
            <Link
              to="/mypage"
              className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 transition"
            >
              マイページ
            </Link>
          )}
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
