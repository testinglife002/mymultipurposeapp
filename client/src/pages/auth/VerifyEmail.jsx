// frontend/src/pages/auth/VerifyEmail.jsx
// frontend/src/pages/auth/VerifyEmail.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Key } from "lucide-react";
import newRequest from "../../api/newRequest";
import "./Auth.css";

export default function VerifyEmail() {
  const loc = useLocation();
  const navigate = useNavigate();
  const preEmail = loc.state?.email || "";
  const [email, setEmail] = useState(preEmail);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await newRequest.post("/auth/verify-email", { email, code });
      setMessage("Verified successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await newRequest.post("/auth/resend-verify", { email });
      setMessage("Verification code resent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Resend failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3 className="auth-title">Verify Email</h3>
        <form onSubmit={handleVerify} className="auth-form">
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
            <Key size={18} className="input-icon" />
            <input
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Verify
          </button>
        </form>

        <div className="mt-2">
          <button className="auth-btn-link" onClick={handleResend}>
            Resend code
          </button>
        </div>

        {message && <div className="auth-message">{message}</div>}
      </div>
    </div>
  );
}
