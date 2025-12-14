import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserEdit({ user }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });
      if (res.ok) {
        alert("ユーザー情報を更新しました");
        navigate("/mypage");
      } else {
        const err = await res.json();
        alert("更新失敗: " + (err.detail || res.status));
      }
    } catch (e) {
      alert("通信エラー");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>ログインしてください</div>;

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">ユーザー情報編集</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          名前:
          <input
            className="border p-2 w-full"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <label className="block mb-2">
          メールアドレス:
          <input
            className="border p-2 w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
        </label>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          type="submit"
          disabled={loading}
        >
          {loading ? "更新中..." : "更新する"}
        </button>
      </form>
    </div>
  );
}