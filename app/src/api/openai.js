// src/api/openai.js

export async function generateDescription(name, userHint = "") {
  if (!name) throw new Error("商品名が未入力です");

  // 環境変数（ビルド時） or public/env.js（デプロイ後の差し替え） を参照
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URLが未設定です。環境変数またはpublic/env.jsを確認してください。");
  }

  const url = `${API_BASE_URL.replace(/\/+$/, "")}/generate_description`;

  try {
    console.debug("generateDescription request URL:", url);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        user_hint: userHint,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(`説明生成に失敗しました（HTTP ${res.status}）: ${errorText}`);
    }

    const data = await res.json().catch(() => null);
    return (data && data.description) || "";
  } catch (err) {
    // ネットワーク例外などをまとめて扱う
    throw new Error(`説明生成に失敗しました: ${err.message}`);
  }
}
