import { useState } from "react";

export default function AllAutoFillButton({ name, userHint, setPrice, setCategory, setDescription, apiBase }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!name || !name.trim()) {
      alert("名前を入力してください!!");
      return;
    }
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      // 1) 価格予測
      const priceRes = await fetch(`${apiBase}/price/predict_price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: name.trim() }),
        signal: controller.signal,
      });
      const priceTxt = await priceRes.text();
      let priceData;
      try { priceData = JSON.parse(priceTxt); } catch { priceData = priceTxt; }
      if (!priceRes.ok) throw new Error(priceData?.detail || priceData?.message || priceTxt || `price status ${priceRes.status}`);
      const predicted = priceData?.predicted_price ?? priceData?.predictedPrice ?? null;
      if (predicted != null) setPrice(String(predicted));

      // 2) カテゴリー推定
      const catRes = await fetch(`${apiBase}/category/predict_category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: name.trim() }),
        signal: controller.signal,
      });
      const catTxt = await catRes.text();
      let catData;
      try { catData = JSON.parse(catTxt); } catch { catData = catTxt; }
      if (!catRes.ok) throw new Error(catData?.detail || catData?.message || catTxt || `category status ${catRes.status}`);
      const predictedCat = (catData && catData.category) || (typeof catData === "string" ? catData : null);
      if (predictedCat) setCategory(String(predictedCat));

      // 3) 説明文生成（バックエンドのエンドポイントに合わせて JSON を投げます）
      // 返却はサーバ実装により { description: "..." } か 直接文字列 のどちらか想定
      const descRes = await fetch(`${apiBase}/generate_description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), user_hint: userHint || "" }),
        signal: controller.signal,
      });
      const descTxt = await descRes.text();
      let descData;
      try { descData = JSON.parse(descTxt); } catch { descData = descTxt; }
      if (!descRes.ok) throw new Error(descData?.detail || descData?.message || descTxt || `desc status ${descRes.status}`);
      const generated = descData?.description || descData?.text || (typeof descData === "string" ? descData : "");
      if (generated) setDescription(String(generated));
    } catch (err) {
      if (err.name === "AbortError") {
        alert("自動生成がタイムアウトしました。通信環境を確認してください。");
      } else {
        console.error("all autofill error:", err);
        alert("自動生成に失敗しました: " + (err.message || ""));
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`w-full md:w-auto px-5 py-3 rounded-full text-sm font-medium transition ${
        loading ? "bg-gray-500 text-black" : "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.12)]"
      }`}
    >
      {loading ? "自動生成中..." : "完全自動生成ボタン"}
    </button>
  );
}