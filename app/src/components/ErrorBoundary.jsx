import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled error in component tree:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl bg-white/5 p-6 rounded-lg border border-white/6 text-slate-100">
            <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
            <p className="text-sm mb-4">アプリの一部でエラーが発生しています。コンソールのエラー内容を確認してください。</p>
            <details className="text-xs whitespace-pre-wrap">
              <summary className="cursor-pointer underline">エラー詳細を見る</summary>
              <pre className="mt-2 text-xs">{String(this.state.error)}</pre>
              <pre className="mt-2 text-xs">{this.state.info?.componentStack}</pre>
            </details>
            <div className="mt-4 flex gap-3">
              <button
                className="px-4 py-2 rounded bg-gradient-to-r from-cyan-400 to-violet-400 text-black"
                onClick={() => window.location.reload()}
              >
                再読み込み
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}