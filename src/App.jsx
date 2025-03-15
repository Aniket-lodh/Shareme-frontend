import "./App.css";
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { fetchUser } from "./utils/fetchUser";
import { ToastProvider } from "./context/Toast";
import { Toaster } from "react-hot-toast";
import { config } from "./utils/variables";
import { DotSpinner } from "./components/Spinner";

// Lazy load components
const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./container/Home"));

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
        <Suspense
          fallback={
            <div className="h-screen flex items-center justify-center">
              <DotSpinner message="Loading..." />
            </div>
          }
        >
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="login" element={<Login />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
