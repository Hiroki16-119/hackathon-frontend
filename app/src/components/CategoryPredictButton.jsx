import { useState } from "react";

export default function CategoryPredictButton({ name, setCategory, apiBase }) {
  const [predicting, setPredicting] = useState(false);

  const handleClick = async () => {
    if (!name || !name.trim()) {
      alert("名前を入力してください!!");
      return;
    }
    setPredicting(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${apiBase}/category/predict_category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: name.trim() }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const txt = await res.text();
      let data;
      try { data = JSON.parse(txt); } catch { data = txt; }

      if (!res.ok) {
        const msg = data?.detail || data?.message || txt || `status ${res.status}`;
        throw new Error(msg);
      }

      const predicted = (data && data.category && String(data.category).trim()) || "";
      if (!predicted) throw new Error("カテゴリーが返りませんでした");

      // サーバ返却値を尊重してそのまま設定
      setCategory(predicted);
    } catch (err) {
      if (err.name === "AbortError") {
        alert("カテゴリー推定がタイムアウトしました。");
      } else {
        console.error("category predict error:", err);
        alert("カテゴリー推定に失敗しました: " + (err.message || ""));
      }
    } finally {
      clearTimeout(timeout);
      setPredicting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={predicting}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        predicting ? "bg-gray-500 text-black" : "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.12)]"
      }`}
    >
      {predicting ? "推定中..." : "カテゴリー推定"}
    </button>
  );
}