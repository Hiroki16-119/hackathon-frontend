import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import LoginForm from "./components/LoginForm";
import MyPage from "./pages/MyPage";
import ProductDetail from "./pages/ProductDetail";
import useAuthProvider from "./hooks/useAuth";
import { useState, useEffect } from "react";
import ProductEdit from "./pages/ProductEdit";
import UserEdit from "./pages/UserEdit";

  // ✅ 環境変数からAPIのベースURLを取得
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const { user, login, logout, signup } = useAuthProvider();
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
  if (!user) return <LoginForm onLogin={login} onSignup={signup} />;


  return (
    <BrowserRouter>
      {/* ナビバーを全画面幅で表示 */}
      <Navbar user={user} onLogout={logout} />
      {/* アプリ全体の中央寄せは中身だけに適用 */}
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <main className="w-full py-10">
          <Routes>
            <Route path="/" element={<Home products={products} user={user} fetchProducts={fetchProducts} />} />
            <Route path="/sell" element={<Sell onProductAdded={fetchProducts} user={user} />} />
            <Route path="/mypage" element={<Navigate to={`/users/${user.uid}`} replace />} />
            <Route path="/users/:id" element={<MyPage user={user} />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/:id/edit" element={<ProductEdit />} />
            <Route path="/users/:id/edit" element={<UserEdit user={user} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}


