import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/index.css";
import { MovieProvider } from "../contexts/MovieProvider";
import { AuthProvider } from "../contexts/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/Movies-app/">
      <AuthProvider>
        <MovieProvider>
          <App />
          <ToastContainer
            position="bottom-right"
            autoClose={4500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </MovieProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
