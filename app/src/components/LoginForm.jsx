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
        // displayName はフロントで送らない設計に合わせて削除
        await onSignup({ email, password });
      } else {
        await onLogin({ email, password });
      }
    } catch (err) {
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-80 mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        {isSignUp ? "新規登録" : "ログイン"}
      </h2>
      {error && <div className="mb-2 text-red-400 text-center">{error}</div>}

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-3 rounded w-full mb-3 bg-transparent text-white placeholder:text-white/60 border-white/14 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label="メールアドレス"
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3 rounded w-full mb-4 bg-transparent text-white placeholder:text-white/60 border-white/14 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label="パスワード"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 text-black font-medium mb-2 hover:brightness-95"
      >
        {loading ? "送信中..." : isSignUp ? "新規登録" : "ログイン"}
      </button>

      <button
        type="button"
        onClick={() => setIsSignUp((v) => !v)}
        aria-label="切替"
        className="w-full text-sm font-semibold text-white mt-1 rounded-md py-2 bg-white/10 hover:bg-white/16 transition-colors border border-white/10"
      >
        {isSignUp ? "ログイン画面へ" : "新規登録はこちら"}
      </button>
    </form>
  );
}
