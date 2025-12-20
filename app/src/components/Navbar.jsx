import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Navbar({ user , onLogout }) {
  return (
    <nav className="w-full sticky top-0 z-50">
      <div className="backdrop-blur-md bg-white/5 border-b border-white/6">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* 左側ロゴ */}
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32}>NG</Logo>
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">
              NextGen Flea
            </span>
          </Link>

          {/* 右側メニュー */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-3 py-1 rounded-md text-sm transition hover:bg-white/10 text-slate-200"
            >
              ホーム
            </Link>
            <Link
              to="/sell"
              className="px-3 py-1 rounded-md text-sm transition hover:bg-white/10 text-slate-200"
            >
              出品
            </Link>
            {user && (
              <Link
                to="/mypage"
                className="px-3 py-1 rounded-md text-sm transition hover:bg-white/10 text-slate-200"
              >
                マイページ
              </Link>
            )}

            {user ? (
              <button
                onClick={onLogout}
                className="ml-2 px-3 py-1 rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm hover:brightness-95 transition shadow-sm"
              >
                ログアウト
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-3 py-1 rounded-md bg-gradient-to-r from-cyan-400 to-violet-400 text-black text-sm font-medium hover:brightness-95 transition shadow-[0_8px_30px_rgba(99,102,241,0.12)]"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .shadow-neon {
          box-shadow: 0 6px 24px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.04);
        }
      `}</style>
    </nav>
  );
}
