import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";

export default function LoginPage({ onLogin, onSignup, user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="w-full max-w-2xl mx-auto relative z-20">
        <div className="bg-gradient-to-r from-indigo-900/50 to-violet-900/40 rounded-2xl p-10 backdrop-blur-md border border-white/6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 justify-center">
            <Logo size={64} className="text-lg" />
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-300">
                NextGen Flea
              </h1>
              <p className="text-base text-slate-300 mt-2">近未来のフリマへようこそ</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <LoginForm onLogin={onLogin} onSignup={onSignup} />
            <div className="mt-6 text-sm text-slate-300">このサイトは学習用プロジェクトです</div>
          </div>
        </div>
      </div>
    </div>
  );
}