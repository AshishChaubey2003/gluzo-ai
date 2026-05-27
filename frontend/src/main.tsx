import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
            background: "#1A1714",
            color: "#FDFCFA",
            borderRadius: "12px",
            padding: "12px 16px",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
