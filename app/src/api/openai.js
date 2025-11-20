// src/api/openai.js

export async function generateDescription(name, userHint = "") {
  if (!name) throw new Error("商品名が未入力です");

    // ✅ 環境変数からAPIのベースURLを取得
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const res = await fetch(`${API_BASE_URL}/generate_description`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name,
      user_hint: userHint, // ✅ 引数から受け取った補足情報を送信
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`説明生成に失敗しました: ${errorText}`);
  }

  const data = await res.json();
  return data.description || "";
}
