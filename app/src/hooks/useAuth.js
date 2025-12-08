import { useState, useCallback, useEffect } from "react";

export default function useAuthProvider() {
  const [user, setUser] = useState(null);

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error("user rehydrate failed", e);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/login`;
    console.debug("[login] request url:", url);
    console.debug("[login] request body:", credentials);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("[login] failed", res.status, text);
        throw new Error(text || `ログインに失敗しました (HTTP ${res.status})`);
      }

      const data = await res.json().catch(() => null);
      // tokenがなければidを使う
      const token = data?.token || data?.id || null;

      if (!token) {
        console.warn("[login] token も id も返ってきませんでした。response:", data);
      }

      // tokenがあるなら /me 取得、なければ login レスポンス内の user を使う
      let profile = null;
      if (token) {
        const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) {
          const mtext = await meRes.text().catch(() => "");
          console.error("[login] /me failed", meRes.status, mtext);
          throw new Error(mtext || "ユーザー情報の取得に失敗しました");
        }
        profile = await meRes.json().catch(() => null);
      } else {
        profile = data?.user || data;
      }

      // tokenを必ずセット
      const saved = { ...profile, token, id: profile?.id || data?.id || token };

      console.log("saved:", saved);
      setUser(saved);
      try { localStorage.setItem("user", JSON.stringify(saved)); } catch (e) { /* ignore */ }

      return saved;
    } catch (err) {
      console.error("[login] exception:", err);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem("user"); } catch (e) { /* ignore */ }
  }, []);

  return { user, setUser, login, logout };
}
