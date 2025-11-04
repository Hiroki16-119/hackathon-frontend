import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import LoginForm from "./components/LoginForm";
import ProductDetail from "./pages/ProductDetail"; // ✅ 商品詳細ページ
import useAuth from "./hooks/useAuth";
import { useState } from "react";

export default function App() {
  const { user, login, logout } = useAuth();

  // 商品データ（説明を追加）
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "古着ジャケット",
      price: 2500,
      imageUrl: "https://placehold.co/300x200",
      description: "ヴィンテージ感のあるデニムジャケットです。サイズはL。",
    },
    {
      id: 2,
      name: "レトロカメラ",
      price: 5500,
      imageUrl: "https://placehold.co/300x200",
      description: "昔懐かしいフィルムカメラ。インテリアにもおすすめ。",
    },
    {
      id: 3,
      name: "スマホケース",
      price: 800,
      imageUrl: "https://placehold.co/300x200",
      description: "透明タイプでシンプルなデザイン。iPhone対応。",
    },
  ]);

  // 新しい商品を追加
  const addProduct = (newProduct) => {
    setProducts((prev) => [
      ...prev,
      { id: prev.length + 1, ...newProduct },
    ]);
  };

  // ログインしてない場合はログインフォームを表示
  if (!user) return <LoginForm onLogin={login} />;

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        {/* 商品一覧ページ */}
        <Route path="/" element={<Home products={products} />} />

        {/* 出品ページ */}
        <Route path="/sell" element={<Sell addProduct={addProduct} />} />

        {/* ✅ 商品詳細ページ */}
        <Route
          path="/product/:id"
          element={<ProductDetail products={products} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
