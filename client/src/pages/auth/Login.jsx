// frontend/src/pages/auth/Login.jsx
// frontend/src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import newRequest, { setToken } from '../../api/newRequest';
import "./Auth.css";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await newRequest.post("/auth/login", { email, password });
      const { user, token } = res.data;
      sessionStorage.setItem("accessToken", token);
      // ✅ Set token in Axios for all requests
      setToken(token);
      // Save user info in state if needed
      console.log("Logged in user:", user);
      console.log("token", token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user) 

      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "author") navigate("/author/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setErr(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3 className="auth-title">Login</h3>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Login
          </button>
          {err && <div className="auth-error">{err}</div>}
        </form>
      </div>
    </div>
  );
}
