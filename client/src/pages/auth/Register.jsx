// frontend/src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, UploadCloud, Phone } from "lucide-react";
import newRequest from "../../api/newRequest";
import axios from "axios";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "", // 👈 added phone
    isAuthor: false,
    role: "user",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mymultipurposeapp");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dvnxusfy8/image/upload",
      data
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let imgUrl = "";
      if (file) imgUrl = await uploadToCloudinary(file);

      if (!form.username || !form.email || !form.password) {
        setError("All fields required");
        return;
      }

      const payload = { ...form, img: imgUrl };
      const res = await newRequest.post("/auth/register", payload);
      alert(
        res.data.message || "Registered. Check email for verification code."
      );
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3 className="auth-title">Register</h3>
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="auth-input"
            />
          </div>

          {/* Email */}
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="auth-input"
            />
          </div>

          {/* Phone */}
          <div className="input-wrapper">
            <Phone size={18} className="input-icon" />
            <input
              placeholder="WhatsApp Number (+8801XXXXXXXXX)"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="auth-input"
            />
          </div>

          {/* Profile Image */}
          <div className="input-wrapper">
            <UploadCloud size={18} className="input-icon" />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="auth-input"
            />
          </div>

          {/* Role Checkbox */}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isAuthor}
              onChange={(e) =>
                setForm({
                  ...form,
                  isAuthor: e.target.checked,
                  role: e.target.checked ? "author" : "user",
                })
              }
            />
            I want to become an author
          </label>

          <button className="auth-btn" type="submit">
            Register
          </button>
          {error && <div className="auth-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

