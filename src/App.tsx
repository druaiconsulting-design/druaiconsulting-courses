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
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663512997684/PPrwKSVlySJjkhTX.png"
          alt="DRU AI Consulting"
          style={{ height: 56, width: "auto", opacity: 0.9 }}
        />
      </div>
    );
  }

  // Admin course management
  if (path === "/admin/courses" || path === "/admin/courses/") {
    setTitle("Course Management · DRU AI Consulting");
    if (!isLoggedIn) return <CourseLogin />;
    if (!isAdmin) { window.location.replace("/courses"); return null; }
    return <AdminCourses />;
  }

  // Admin student preview — bypasses enrollment check and admin redirect
  if (path === "/preview" || path === "/preview/") {
    setTitle("Student Preview · DRU AI Consulting");
    if (!isLoggedIn || !isAdmin) return <CourseLogin />;
    return <CourseDashboard adminPreview />;
  }

  // Login page
  if (path === "/login" || path === "/login/") {
    setTitle("Sign In · DRU AI Consulting Courses");
    if (isLoggedIn) { window.location.replace(isAdmin ? "/admin/courses" : "/courses"); return null; }
    return <CourseLogin />;
  }

  // Main course dashboard — admin redirects to management
  if (path === "/courses" || path === "/courses/" || path === "/" || path === "") {
    setTitle("From Confusion to Confident with AI™ · DRU AI Consulting");
    if (!isLoggedIn) return <CourseLogin />;
    if (isAdmin) { window.location.replace("/admin/courses"); return null; }
    return <CourseDashboard />;
  }

  // Fallback
  setTitle("From Confusion to Confident with AI™");
  if (isLoggedIn) { window.location.replace(isAdmin ? "/admin/courses" : "/courses"); return null; }
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
