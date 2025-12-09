import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AllSchools from "./pages/AllSchools";
import DataComparison from "./pages/DataComparison";
import SchoolDetail from "./pages/SchoolDetail";
import Submit from "./pages/Submit";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import UserCenter from "./pages/UserCenter";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ReviewManagement from "./pages/admin/ReviewManagement";
import SchoolManagement from "./pages/admin/SchoolManagement";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith("/admin") &&
    location.pathname !== "/admin/login";

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? "" : "main-content"}>
        <Routes>
          {/* 公开路由 */}
          <Route path="/" element={<Home />} />
          <Route path="/all-schools" element={<AllSchools />} />
          <Route path="/data-comparison" element={<DataComparison />} />
          <Route path="/school/:id" element={<SchoolDetail />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 需要登录的路由 */}
          <Route
            path="/user-center"
            element={
              <PrivateRoute>
                <UserCenter />
              </PrivateRoute>
            }
          />

          {/* 管理后台路由 */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<ReviewManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="schools" element={<SchoolManagement />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
