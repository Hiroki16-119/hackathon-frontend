import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import LoginPage from "./pages/Login";
import MyPage from "./pages/MyPage";
import ProductDetail from "./pages/ProductDetail";
import useAuthProvider from "./hooks/useAuth";
import { useState, useEffect } from "react";
import ProductEdit from "./pages/ProductEdit";
import UserEdit from "./pages/UserEdit";
import Background from "./components/Background";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const { user, login, logout, signup } = useAuthProvider();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error("商品一覧の取得に失敗しました");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ログイン検知で自動的にホームへ移動（ログインページにいる場合）
  useEffect(() => {
    if (user) {
      // 現在 /login にいるときのみ自動遷移（リロードせず確実に遷移したければ window.location.replace を使ってください）
      if (window.location.pathname === "/login") {
        window.location.replace("/");
      }
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="min-h-screen relative text-slate-100">
        <Background />

  

        {/* ナビバーはログイン後のみ表示 */}
        {user && <Navbar user={user} onLogout={logout} />}

        {/* コンテンツを前面に出す */}
        <div className="max-w-7xl mx-auto px-4 pt-20 relative z-20">
          <main className="w-full py-10">
            <Routes>
              {/* 公開 / ログイン */}
              <Route
                path="/login"
                element={<LoginPage onLogin={login} onSignup={signup} user={user} />}
              />

              {/* ホームはログインが必要なら /login にリダイレクト */}
              <Route
                path="/"
                element={
                  user ? (
                    <Home products={products} user={user} fetchProducts={fetchProducts} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* 出品はログイン必須 */}
              <Route
                path="/sell"
                element={
                  user ? (
                    <Sell onProductAdded={fetchProducts} user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/mypage"
                element={user ? <Navigate to={`/users/${user.uid}`} replace /> : <Navigate to="/login" />}
              />
              <Route path="/users/:id" element={<MyPage user={user} />} />

              {/* 商品詳細は公開 */}
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* 編集はログイン必須 */}
              <Route
                path="/products/:id/edit"
                element={user ? <ProductEdit /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/users/:id/edit"
                element={user ? <UserEdit user={user} /> : <Navigate to="/login" replace />}
              />

              {/* 未定義はホームへ */}
              <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}


