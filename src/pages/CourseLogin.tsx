import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function CourseLogin() {
  const { login, loginWithGoogle } = useAuth();
  const [showLogin, setShowLogin]   = useState(false);
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error || "Login failed.");
    else window.location.href = "/courses";
  };

  const handleGoogle = async () => {
    setError("");
    await loginWithGoogle();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6,
    padding: "0.75rem 1rem", color: "#FFFFFF",
    fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#071a30", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663512997684/PPrwKSVlySJjkhTX.png" alt="DRU AI Consulting" style={{ height: 100, width: "auto", margin: "0 auto" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Course header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: "#D4AF37", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "0.6rem" }}>DRU AI Consulting</p>
          <h1 style={{ fontFamily: "'Cinzel', serif", color: "#FFFFFF", fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.45, marginBottom: "0.75rem" }}>From Confusion to Confident<br />with AI™</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(230,230,230,0.5)", fontSize: "0.78rem", lineHeight: 1.7 }}>
            Turn AI overwhelm into strategic advantage. Led by DeAnna R. Upshaw — AI Authority, Executive Coach, and Founder of the DRU AI Leadership Ecosystem™.
          </p>
        </div>

        {!showLogin ? (
          <>
            {/* Payment tiers — PRIMARY action */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {[
                {
                  label: "Self-Paced",
                  price: "$1,497",
                  sub: "Learn on your schedule · Lifetime access",
                  href: "https://link.druaiconsulting.com/payment-link/69f55d0cb615f70a8a33b5fd",
                  color: "#D4AF37",
                  featured: false,
                },
                {
                  label: "Live Cohort",
                  price: "$7,997",
                  sub: "Live sessions with DeAnna · Community access",
                  href: "https://link.druaiconsulting.com/payment-link/69f55e7bb18c99dd72d3c0e5",
                  color: "#C2185B",
                  featured: true,
                },
                {
                  label: "Cohort Mastermind",
                  price: "$12,997",
                  sub: "VIP access · Private coaching · Full ecosystem",
                  href: "https://link.druaiconsulting.com/payment-link/69f55bf3b615f70a8a33b5fb",
                  color: "#43A047",
                  featured: false,
                },
              ].map(tier => (
                <a key={tier.label} href={tier.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderRadius: 10, border: `1px solid ${tier.color}${tier.featured ? "80" : "40"}`, background: tier.featured ? `${tier.color}12` : `${tier.color}08`, textDecoration: "none", transition: "all 0.2s" }}>
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", color: "#FFFFFF", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 3px" }}>{tier.label}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(230,230,230,0.45)", fontSize: "0.68rem", margin: 0 }}>{tier.sub}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1rem" }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", color: tier.color, fontWeight: 700, fontSize: "1.1rem", margin: "0 0 2px" }}>{tier.price}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", color: tier.color, fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", margin: 0 }}>ENROLL →</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", color: "rgba(230,230,230,0.2)", fontSize: "0.65rem" }}>already enrolled?</span>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Secondary — sign in */}
            <button onClick={() => setShowLogin(true)}
              style={{ width: "100%", background: "transparent", color: "rgba(212,175,55,0.7)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "0.75rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s" }}>
              Sign In to Access My Course
            </button>
          </>
        ) : (
          /* Login form — shown only when "Sign In" is clicked */
          <div style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#FFFFFF", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Sign In</h2>
              <button onClick={() => { setShowLogin(false); setError(""); }}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'Montserrat', sans-serif" }}>← Back</button>
            </div>

            {/* Google */}
            <button onClick={handleGoogle}
              style={{ width: "100%", background: "rgba(255,255,255,0.07)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "0.8rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.04em", cursor: "pointer", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", color: "rgba(230,230,230,0.25)", fontSize: "0.65rem" }}>or</span>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.1)" }} />
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

      <footer style={{ marginTop: "2.5rem", color: "rgba(255,255,255,0.12)", fontFamily: "'Montserrat', sans-serif", fontSize: "0.58rem", letterSpacing: "0.04em", textAlign: "center" }}>
        &copy; 2026 DRU AI Consulting · From Confusion to Confident with AI™ · All Rights Reserved
      </footer>
    </div>
  );
}
