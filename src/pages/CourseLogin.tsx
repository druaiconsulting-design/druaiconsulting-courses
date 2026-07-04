import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function CourseLogin({ adminMode = false }: { adminMode?: boolean }) {
  const { login, loginWithGoogle } = useAuth();
  const [showLogin, setShowLogin]   = useState(adminMode);
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error || "Login failed.");
    else window.location.href = adminMode ? "/admin" : "/courses";
  };

  const handleGoogle = async () => {
    setError("");
    await loginWithGoogle();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#FFFFFF",
    border: "1px solid rgba(10,35,66,0.18)", borderRadius: 6,
    padding: "0.75rem 1rem", color: "#0A2342",
    fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#FAFAF8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>

      {/* Hero image — carries the branding + course messaging */}
      <div style={{ width: "100%", maxWidth: 340, marginBottom: "2rem", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 32px rgba(10,35,66,0.12)" }}>
        <img src="/confidence-social-light.png" alt="From Confusion to Confident with AI — DRU CLEAR" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 440 }}>

        {!showLogin ? (
          <>
            {/* Self-Paced enrollment — PRIMARY action */}
            <a href="https://link.druaiconsulting.com/payment-link/69f55d0cb615f70a8a33b5fd" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderRadius: 10, border: "1px solid rgba(212,175,55,0.4)", background: "#FFFFFF", textDecoration: "none", transition: "all 0.2s", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", color: "#0A2342", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 3px" }}>Self-Paced</p>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(10,35,66,0.5)", fontSize: "0.72rem", margin: 0 }}>Learn on your schedule · Lifetime access</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1rem" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", color: "#D4AF37", fontWeight: 700, fontSize: "1.2rem", margin: "0 0 2px" }}>$1,497</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", color: "#D4AF37", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", margin: 0 }}>ENROLL →</p>
              </div>
            </a>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(10,35,66,0.12)" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", color: "rgba(10,35,66,0.35)", fontSize: "0.65rem" }}>already enrolled?</span>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(10,35,66,0.12)" }} />
            </div>

            {/* Secondary — sign in */}
            <button onClick={() => setShowLogin(true)}
              style={{ width: "100%", background: "#FFFFFF", color: "#0A2342", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 8, padding: "0.75rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s" }}>
              Sign In to Access My Course
            </button>
          </>
        ) : (
          /* Login form — shown only when "Sign In" is clicked */
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, padding: "1.75rem", boxShadow: "0 4px 24px rgba(10,35,66,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0A2342", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Sign In</h2>
              {!adminMode && (
                <button onClick={() => { setShowLogin(false); setError(""); }}
                  style={{ background: "none", border: "none", color: "rgba(10,35,66,0.4)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'Montserrat', sans-serif" }}>← Back</button>
              )}
            </div>

            {/* Google */}
            <button onClick={handleGoogle}
              style={{ width: "100%", background: "#FFFFFF", color: "#0A2342", border: "1px solid rgba(10,35,66,0.18)", borderRadius: 6, padding: "0.8rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.04em", cursor: "pointer", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(10,35,66,0.12)" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", color: "rgba(10,35,66,0.3)", fontSize: "0.65rem" }}>or</span>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(10,35,66,0.12)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={inputStyle} />
            </div>

            {error && <p style={{ color: "#E53935", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", marginBottom: "0.875rem", textAlign: "center" }}>{error}</p>}

            <button onClick={handleLogin} disabled={loading}
              style={{ width: "100%", background: "#D4AF37", color: "#0A2342", border: "none", borderRadius: 6, padding: "0.85rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.06em", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing In..." : "Access My Course"}
            </button>
          </div>
        )}
      </div>

      <footer style={{ marginTop: "2.5rem", color: "rgba(10,35,66,0.3)", fontFamily: "'Montserrat', sans-serif", fontSize: "0.58rem", letterSpacing: "0.04em", textAlign: "center" }}>
        &copy; 2026 DRU AI Consulting · From Confusion to Confident with AI™ · All Rights Reserved
      </footer>
    </div>
  );
}
