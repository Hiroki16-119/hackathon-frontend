import { useState } from "react";

export default function LoginForm({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await onSignup({ email, password });
        alert("新規登録に成功しました！");
      } else {
        await onLogin({ email, password });
      }
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("メールアドレスかパスワードが正しくありません");
      } else {
        setError(err.message || "エラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "新規登録" : "ログイン"}
        </h2>
        {error && (
          <div className="mb-2 text-red-600 text-center">{error}</div>
        )}
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
        >
          {loading
            ? "送信中..."
            : isSignUp
            ? "新規登録"
            : "ログイン"}
        </button>
        <button
          type="button"
          className="mt-2 text-blue-500 underline w-full"
          onClick={() => setIsSignUp((v) => !v)}
        >
          {isSignUp ? "ログイン画面へ" : "新規登録はこちら"}
        </button>
      </form>
    </div>
  );
}
