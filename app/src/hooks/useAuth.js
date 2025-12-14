import { useState, useCallback, useEffect } from "react";
import { signInWithEmail, signUpWithEmail, auth } from "../a/firebase";

// .envからAPIのベースURLを取得
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // Firebaseでログイン
  const login = useCallback(async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmail(email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      const saved = {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        token, // ← ここで必ずセット
        displayName: firebaseUser.displayName,
      };
      setUser(saved);
      localStorage.setItem("user", JSON.stringify(saved));
      return saved;
    } catch (err) {
      console.error("[login] exception:", err);
      throw err;
    }
  }, []);

  // Firebaseで新規登録
  const signup = useCallback(async ({ email, password }) => {
    try {
      const userCredential = await signUpWithEmail(email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      const saved = {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        token, // ← ここで必ずセット
        displayName: firebaseUser.displayName,
      };
      setUser(saved);
      localStorage.setItem("user", JSON.stringify(saved));

      // Firebaseで新規登録後、バックエンドにもユーザー情報を送信
      try {
        await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${saved.token}`,
          },
          body: JSON.stringify({
            uid: saved.uid,
            email: saved.email,
            displayName: saved.displayName,
          }),
        });
      } catch (apiErr) {
        // バックエンド登録失敗時もFirebaseユーザーは維持
        console.error("[signup] backend user registration failed:", apiErr);
      }

      return saved;
    } catch (err) {
      console.error("[signup] exception:", err);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem("user"); } catch (e) { /* ignore */ }
    auth.signOut();
  }, []);

  console.log("user:", user);

  return { user, setUser, login, logout, signup };
}
