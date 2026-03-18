import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="bg-background-light min-h-screen flex flex-col font-display text-slate-900">
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined !text-[20px]">school</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">CampusConnect</h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Support</Link>
          <Link to="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Documentation</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
              <span className="material-symbols-outlined text-primary !text-[32px]">admin_panel_settings</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm">Enter your administrator credentials to manage your campus</p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]">mail</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@university.edu"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-transparent px-10 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-transparent px-10 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined !text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent" />
                  <label htmlFor="remember" className="text-sm font-medium leading-none text-slate-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <Link to="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-700 disabled:opacity-70 h-11 px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                {!loading && <span className="material-symbols-outlined !text-[18px]">login</span>}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 h-10 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 h-10 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                </svg>
                <span className="text-sm font-medium">SAML</span>
              </button>
            </div>
          </div>
          
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/admin/signup" className="font-medium text-primary hover:underline underline-offset-4">
              Sign up for an admin profile
            </Link>
          </p>
        </div>
      </main>

      <footer className="w-full py-8 px-6 text-center border-t border-slate-200">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} CampusConnect University Systems. All rights reserved. <br className="md:hidden"/>
          <Link to="#" className="hover:text-slate-600 mx-2 transition-colors">Privacy Policy</Link>
          <span className="hidden md:inline">•</span>
          <Link to="/admin/terms" className="hover:text-slate-600 mx-2 transition-colors">Terms of Service</Link>
        </p>
      </footer>
    </div>
  );
};

export default Login;
