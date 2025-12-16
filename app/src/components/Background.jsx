import React from "react";

export default React.memo(function Background() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{willChange: "transform"}}>
      {/* 背景グラデは最背面に */}
      <div
        className="bg-gradient absolute inset-0"
        style={{ zIndex: 0 }}
      />

      {/* ネビュラ（色ムラ・二重境界を抑えるため mix-blend-mode を通常寄せに） */}
      <div
        className="nebula absolute inset-0"
        style={{ zIndex: 1 }}
      />

      {/* オーロラ（ゆっくり動く帯） */}
      <div
        className="aurora absolute inset-0"
        style={{ zIndex: 2 }}
      />

      {/* 星層は最前面でさりげない点滅 */}
      <div
        className="stars absolute inset-0"
        style={{ zIndex: 3 }}
      />

      <style>{`
        :root{
          --nebula-opacity: 0.24;
          --stars-opacity: 0.9;
          --aurora-opacity: 0.18;
        }

        /* 背景グラデ：なめらかにしてバンディングを軽減 */
        .bg-gradient {
          background: radial-gradient(1200px 600px at 10% 10%, rgba(20,24,30,0.85), transparent 20%),
                      radial-gradient(900px 500px at 90% 90%, rgba(6,8,15,0.85), transparent 18%),
                      linear-gradient(180deg, rgba(17,24,39,1), rgba(5,6,10,1));
          filter: saturate(110%);
          transform: translateZ(0);
        }

        .nebula{
          background:
            radial-gradient(900px 420px at 8% 18%, rgba(99,102,241,var(--nebula-opacity)), transparent 18%),
            radial-gradient(700px 360px at 78% 72%, rgba(139,92,246,calc(var(--nebula-opacity) * 0.85)), transparent 14%);
          filter: blur(40px) saturate(110%);
          opacity: 1;
          transform-origin: center;
          animation: nebulaDrift 40s ease-in-out infinite;
          will-change: transform, opacity;
          mix-blend-mode: normal; /* ← additive による色ムラを抑える */
        }

        .aurora{
          background:
            linear-gradient(90deg, rgba(56,189,248,var(--aurora-opacity)), rgba(139,92,246,var(--aurora-opacity)), rgba(99,102,241,var(--aurora-opacity)));
          background-size: 300% 100%;
          filter: blur(28px) saturate(120%);
          animation: auroraWave 18s linear infinite;
          will-change: background-position;
          mix-blend-mode: screen;
          opacity: 0.95;
        }

        .stars{
          background-image:
            radial-gradient(2px 2px rgba(255,255,255,0.95) 1px, transparent 1px),
            radial-gradient(1px 1px rgba(255,255,255,0.7) 1px, transparent 1px);
          background-size: 100px 100px, 200px 200px;
          opacity: var(--stars-opacity);
          animation: starMove 220s linear infinite;
          mix-blend-mode: screen;
          will-change: transform, opacity;
          transform: translateZ(0);
        }
        .stars::after{
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(0.8px 0.8px rgba(255,255,255,0.7) 1px, transparent 1px);
          background-size: 220px 220px;
          opacity: 0.7;
          animation: starTwinkle 6s linear infinite;
          mix-blend-mode: screen;
        }

        /* アニメーション */
        @keyframes starMove {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(0, -520px, 0); }
        }
        @keyframes starTwinkle {
          0% { opacity: 0.55; }
          50% { opacity: 1; }
          100% { opacity: 0.55; }
        }
        @keyframes nebulaDrift {
          0% { transform: translate3d(-1.5%, 0, 0) scale(1); }
          50% { transform: translate3d(1.5%, -0.8%, 0) scale(1.02); }
          100% { transform: translate3d(-1.5%, 0, 0) scale(1); }
        }
        @keyframes auroraWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* パフォーマンス配慮 */
        @media (prefers-reduced-motion: reduce) {
          .stars, .stars::after, .nebula, .aurora { animation: none !important; }
        }
      `}</style>
    </div>
  );
});