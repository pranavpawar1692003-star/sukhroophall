import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the redirect path from location state, or default to /admin
  const from = location.state?.from?.pathname || "/admin";

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError("Admin user created! Please login with these credentials.");
      setShowSetup(false);
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Admin user already exists. Please login.");
        setShowSetup(false);
      } else {
        setError("Failed to create admin user: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Redirect back to the protected page they tried to access
      navigate(from, { replace: true });
    } catch (err: any) {
      setError("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-royal/90 to-royal/80 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-gold/30 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-gold mb-2">Admin Login</h1>
          <p className="text-cream/80">Sign in to manage your venue</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {!showSetup ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-cream/90 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white placeholder-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-cream/90 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white placeholder-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowSetup(true)}
                className="text-cream/60 text-sm hover:text-gold transition-colors"
              >
                Don't have an account? Create admin user
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSetup} className="space-y-6">
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
              <p className="text-cream/80 text-sm">
                Create your admin account. This will be the first admin user for your site.
              </p>
            </div>

            <div>
              <label className="block text-cream/90 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white placeholder-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-cream/90 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white placeholder-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Admin Account"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowSetup(false)}
                className="text-cream/60 text-sm hover:text-gold transition-colors"
              >
                Back to login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
