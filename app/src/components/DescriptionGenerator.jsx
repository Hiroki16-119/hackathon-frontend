import { useState } from "react";
import { generateDescription } from "../api/openai";

export default function DescriptionGenerator({ name, userHint, setDescription }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name || !name.trim()) {
      alert("先に商品名を入力してください！");
      return;
    }
    setLoading(true);
    try {
      const desc = await generateDescription(name.trim(), userHint || "");
      setDescription(desc);
    } catch (err) {
      console.error(err);
      alert("説明生成に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        loading ? "bg-gray-500 text-black" : "bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_8px_30px_rgba(99,102,241,0.12)]"
      }`}
    >
      {loading ? "生成中..." : "説明を生成"}
    </button>
  );
}