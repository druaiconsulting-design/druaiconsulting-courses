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
          alt="DRU CLEAR™"
          style={{ height: 56, width: "auto", opacity: 0.9 }}
        />
      </div>
    );
  }

  // Admin course management
  if (path === "/admin/courses" || path === "/admin/courses/") {
    setTitle("Course Management · DRU CLEAR™");
    if (!isLoggedIn || !isAdmin) return <CourseLogin />;
    return <AdminCourses />;
  }

  // Main course dashboard (protected — enrollment checked inside)
  if (path === "/courses" || path === "/courses/" || path === "/" || path === "") {
    setTitle("From Confusion to Confident with AI™ · DRU CLEAR™");
    if (!isLoggedIn) return <CourseLogin />;
    return <CourseDashboard />;
  }

  // Login
  if (path === "/login" || path === "/login/") {
    setTitle("Sign In · DRU CLEAR™ Courses");
    return <CourseLogin />;
  }

  // Fallback
  setTitle("From Confusion to Confident with AI™");
  if (isLoggedIn) return <CourseDashboard />;
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
