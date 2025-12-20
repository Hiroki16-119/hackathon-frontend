import { Navigate } from "react-router-dom";

export default function RequireAuth({ user, loading, children }) {
  // 読み込み中は何もレンダーしない（ローディング表示に置き換えても良い）
  if (loading) return null;

  // 未ログインなら /login にリダイレクト
  if (!user) return <Navigate to="/login" replace />;

  return children;
}