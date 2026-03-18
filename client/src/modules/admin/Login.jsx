import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import api from "../../api";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/admin/welcome");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cn-auth-page">
      <header className="cn-auth-topbar">
        <Link to="/" className="cn-auth-brandmark">
          <div className="cn-auth-brandmark-icon">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <span className="cn-auth-brandmark-text">Campus Netra</span>
        </Link>

        <nav className="cn-auth-topnav">
          <Link to="/support">Support</Link>
          <Link to="/resources">Resources</Link>
        </nav>
      </header>

      <main className="cn-auth-main">
        <div className="cn-auth-shell">
          <div className="cn-auth-header">
            <h1 className="cn-auth-heading">Welcome back</h1>
            <p className="cn-auth-subtext">
              Sign in to your administrator dashboard
            </p>
          </div>

          <div className="cn-auth-card">
            {error && (
              <div className="cn-auth-alert">
                <span>{error}</span>
              </div>
            )}

            <form className="cn-auth-form" onSubmit={handleSubmit}>
              <div className="cn-auth-field">
                <label htmlFor="email">Work Email</label>
                <div className="cn-auth-input-wrap">
                  <Mail size={18} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@university.edu"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="cn-auth-field">
                <label htmlFor="password">Password</label>
                <div className="cn-auth-input-wrap">
                  <Lock size={18} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    className="cn-auth-toggle"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="cn-auth-row">
                <label className="cn-auth-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Stay signed in</span>
                </label>

                <a href="#" className="cn-auth-inline-link">
                  Forgot password?
                </a>
              </div>

              <button
                className="cn-auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign in to Dashboard"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="cn-auth-footer-note">
              Don't have an admin account?{" "}
              <Link to="/admin/signup" className="cn-auth-inline-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="cn-auth-bottom">
        <div className="cn-auth-bottom-nav">
          <Link to="/platform">Platform</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/support">Support</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>

        <div className="cn-auth-bottom-legal">
          <p className="cn-auth-copyright">
            © {new Date().getFullYear()} Campus Netra. Proudly serving Galgotias
            University.
          </p>
          <a
            href="https://syntax-sinners.github.io/web/"
            target="_blank"
            rel="noreferrer"
            className="cn-auth-badge"
          >
            Built by <span>Syntax Sinners</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
