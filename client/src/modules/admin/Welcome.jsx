import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Shield, User } from "lucide-react";
import "./auth.css";

const REDIRECT_MS = 3500;
const TICK_MS = 100;

const Welcome = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    "Administrator";

  const department =
    user?.dept_name ||
    user?.department ||
    user?.department_name ||
    "Department not available";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const totalTicks = Math.ceil(REDIRECT_MS / TICK_MS);
    let tick = 0;

    const progressTimer = setInterval(() => {
      tick += 1;
      const pct = Math.min(100, Math.round((tick / totalTicks) * 100));
      setProgress(pct);
    }, TICK_MS);

    const navTimer = setTimeout(() => {
      navigate("/admin/dashboard", { replace: true });
    }, REDIRECT_MS);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="cn-auth-page">
      <header className="cn-auth-topbar">
        <Link to="/" className="cn-auth-brandmark">
          <div className="cn-auth-brandmark-icon">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <span className="cn-auth-brandmark-text">Campus Netra</span>
        </Link>
      </header>

      <main className="cn-auth-main">
        <div className="cn-auth-shell" style={{ maxWidth: "560px" }}>
          <div className="cn-auth-card" style={{ padding: "2.25rem" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#101828",
              }}
            >
              Welcome, {userName}
            </h1>

            <p style={{ marginTop: "0.75rem", marginBottom: "1.5rem", color: "#667085" }}>
              Preparing your admin workspace.
            </p>

            <div
              style={{
                display: "grid",
                gap: "0.75rem",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #e4e7ec",
                background: "#f9fafb",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                <User size={16} color="#f97316" />
                <span style={{ fontSize: "0.95rem" }}>{userName}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                <Building2 size={16} color="#f97316" />
                <span style={{ fontSize: "0.95rem" }}>{department}</span>
              </div>
            </div>

            <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.85rem", color: "#667085", fontWeight: 600 }}>
                Redirecting to dashboard
              </span>
              <span style={{ fontSize: "0.85rem", color: "#667085", fontWeight: 600 }}>{progress}%</span>
            </div>

            <div
              style={{
                height: "10px",
                borderRadius: "999px",
                background: "#e4e7ec",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #f97316 0%, #ea580c 100%)",
                  transition: `width ${TICK_MS}ms linear`,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;