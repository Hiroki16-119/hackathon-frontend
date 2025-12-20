import React from "react";

export default function Logo({ size = 16, children = "NG", className = "" }) {
  // size は幅高さの数値（px）
  const s = Number(size);
  const sizeClass = `w-${s} h-${s}`; // tailwind のユーティリティが使えない場合は style を使う
  return (
    <div
      className={`rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 shadow-neon flex items-center justify-center text-black font-bold text-lg ${className}`}
      style={{ width: s, height: s, lineHeight: `${s}px` }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}