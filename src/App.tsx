import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CourseLogin from "./pages/CourseLogin";
import CourseDashboard from "./pages/CourseDashboard";
import AdminCourses from "./pages/AdminCourses";

function setTitle(title: string) {
  document.title = title;
}

function Router() {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const path = window.location.pathname;

  if (loading) {
    setTitle("From Confusion to Confident with AI™");
    return (
      <div style={{ minHeight: "100dvh", background: "#0A2342", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.02em", opacity: 0.9 }}>DRU AI Consulting</span>
      </div>
    );
  }

  // Admin course management
  if (path === "/admin" || path === "/admin/") {
    setTitle("Course Management · DRU AI Consulting");
    if (!isLoggedIn) return <CourseLogin adminMode />;
    if (!isAdmin) { window.location.replace("/courses"); return null; }
    return <AdminCourses />;
  }

  // Login page
  if (path === "/login" || path === "/login/") {
    setTitle("Sign In · DRU AI Consulting Courses");
    if (isLoggedIn) { window.location.replace(isAdmin ? "/admin" : "/courses"); return null; }
    return <CourseLogin />;
  }

  // Course dashboard — admin can view without redirect (same as Client View in main app)
  if (path === "/courses" || path === "/courses/" || path === "/" || path === "") {
    setTitle("From Confusion to Confident with AI™ · DRU AI Consulting");
    if (!isLoggedIn) return <CourseLogin />;
    return <CourseDashboard />;
  }

  // Fallback
  setTitle("From Confusion to Confident with AI™");
  if (isLoggedIn) { window.location.replace(isAdmin ? "/admin" : "/courses"); return null; }
  return <CourseLogin />;
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
