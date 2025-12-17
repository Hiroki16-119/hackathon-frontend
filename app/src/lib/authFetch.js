// 新規ファイル：Firebase 認証状態を待ってから fetch を行うユーティリティ
import { getAuth, onAuthStateChanged } from "firebase/auth";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function waitForAuthState(timeout = 5000) {
  const auth = getAuth();
  const cur = auth.currentUser;
  if (cur) return Promise.resolve(cur);
  return new Promise((resolve) => {
    const off = onAuthStateChanged(auth, (user) => {
      off();
      resolve(user);
    });
    setTimeout(() => {
      try { off(); } catch {}
      resolve(null);
    }, timeout);
  });
}

/**
 * authFetch(pathOrUrl, fetchOptions, { requireAuth, waitMs })
 * - pathOrUrl: 相対パス or 絶対 URL
 * - requireAuth: true の場合はトークンが取れないと 401 を返す（fetch は行わない）
 * - 戻り値は window.fetch と同じ Response
 */
export default async function authFetch(pathOrUrl, fetchOptions = {}, opts = {}) {
  const { requireAuth = false, waitMs = 5000 } = opts;
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${API_BASE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

  // requireAuth が true のときは認証完了を待つ
  if (requireAuth) {
    const user = await waitForAuthState(waitMs);
    if (!user) {
      return new Response(JSON.stringify({ detail: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = await user.getIdToken(true);
    fetchOptions.headers = { ...(fetchOptions.headers || {}), Authorization: `Bearer ${token}` };
    return fetch(url, fetchOptions);
  }

  // requireAuth でない場合は, 可能ならトークンを付けて fetch を試す（非同期で currentUser を参照）
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      fetchOptions.headers = { ...(fetchOptions.headers || {}), Authorization: `Bearer ${token}` };
    }
  } catch (e) {
    // トークン取得失敗しても fetch を行う（非致命）
  }
  return fetch(url, fetchOptions);
}