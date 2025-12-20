import { useState } from "react";

export default function PriceCheckButton({ name, price, apiBase }) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!name || !name.trim()) {
      alert("名前を入力してください!!");
      return;
    }
    setChecking(true);
    setResult(null);

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

      const predicted = Number(data?.predicted_price ?? data?.predicted_price ?? null);
      if (!predicted || Number.isNaN(predicted)) throw new Error("予測価格が返りませんでした");

      const actual = Number(price) || 0;
      const diffPercent = actual > 0 ? ((actual - predicted) / predicted) * 100 : null;
      let verdict = "判定できません";
      if (diffPercent !== null) {
        const absDiff = Math.abs(diffPercent);
        if (absDiff <= 20) verdict = "妥当";
        else if (diffPercent > 20) verdict = "高め";
        else verdict = "安め";
      }

      setResult({
        predicted: Math.round(predicted),
        actual: actual || null,
        diffPercent: diffPercent !== null ? Number(diffPercent.toFixed(1)) : null,
        verdict,
      });
    } catch (err) {
      if (err.name === "AbortError") {
        alert("価格推定がタイムアウトしました。");
      } else {
        console.error("price check error:", err);
        alert("価格チェックに失敗しました: " + (err.message || ""));
      }
    } finally {
      clearTimeout(timeout);
      setChecking(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCheck}
        disabled={checking}
        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
          checking ? "bg-gray-500 text-black" : "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.12)]"
        }`}
      >
        {checking ? "判定中..." : "適正価格チェック"}
      </button>

      {result && (
        <div className="mt-3 p-3 rounded-md border border-white/6 bg-white/5 text-sm">
          <div>予測価格: <strong>{result.predicted}円</strong></div>
          <div>実際の価格: <strong>{result.actual ?? "未設定"}</strong></div>
          <div>差分: <strong>{result.diffPercent !== null ? `${result.diffPercent}%` : "―"}</strong></div>
          <div className="mt-2">判定: <strong>{result.verdict}</strong></div>
        </div>
      )}
    </>
  );
}