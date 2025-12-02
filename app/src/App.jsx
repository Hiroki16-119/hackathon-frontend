import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import LoginForm from "./components/LoginForm";
import ProductDetail from "./pages/ProductDetail";
import useAuth from "./hooks/useAuth";
import { useState, useEffect } from "react";

  // ✅ 環境変数からAPIのベースURLを取得
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const { user, login, logout } = useAuth();
  const [products, setProducts] = useState([]);

  // ✅ 商品一覧を取得する関数
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

  // ✅ 初回レンダリング時に商品一覧を取得
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ ログインしてない場合はログインフォームを表示
  if (!user) return <LoginForm onLogin={login} />;

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        {/* 商品一覧ページ */}
        <Route path="/" element={<Home products={products} />} />

        {/* 出品ページ（出品成功後に一覧を再取得） */}
        <Route path="/sell" element={<Sell onProductAdded={fetchProducts} />} />

        {/* 商品詳細ページ */}
        <Route
          path="/product/:id"
          element={<ProductDetail products={products} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
