import "./App.css";
import Login from "./components/Login";
import Home from "./container/Home";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { fetchUser } from "./utils/fetchUser";
import { ToastProvider } from './context/Toast';
import { Toaster } from "react-hot-toast";
import { config } from './utils/variables';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <ToastProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#363636",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px",
            },
          }}
        />
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;