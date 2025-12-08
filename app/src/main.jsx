import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // ← Tailwind 読み込み
import './App.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("API:", import.meta.env.VITE_API_BASE_URL);