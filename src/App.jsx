import "./App.css";
import Login from "./components/Login";
import Home from "./container/Home";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { fetchUser } from "./utils/fetchUser";
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = fetchUser();
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API_TOKEN}>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}
export default App;
