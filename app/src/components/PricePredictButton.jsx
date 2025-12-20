import { useState } from "react";

export default function PricePredictButton({ name, setPrice, apiBase }) {
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
      const res = await fetch(`${apiBase}/price/predict_price`, {
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

      const predicted = data?.predicted_price ?? null;
      if (predicted == null) throw new Error("予測価格が返りませんでした");

      // Sell.jsx の price は文字列で管理しているため文字列にしてセット
      setPrice(String(predicted));
    } catch (err) {
      if (err.name === "AbortError") {
        alert("価格推定がタイムアウトしました。");
      } else {
        console.error("price predict error:", err);
        alert("価格推定に失敗しました: " + (err.message || ""));
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
      {predicting ? "推定中..." : "価格を推定"}
    </button>
  );
}