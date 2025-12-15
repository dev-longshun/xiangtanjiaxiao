import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
// 管理后台
import AdminLayout from "./pages/admin/AdminLayout";
import ReviewManagement from "./pages/admin/ReviewManagement";
import SchoolManagement from "./pages/admin/SchoolManagement";
import SchoolForm from "./pages/admin/SchoolForm";
import AdminSchoolDetail from "./pages/admin/SchoolDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 管理后台路由（独立布局，不使用前台 Header/Footer） */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/reviews" replace />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="schools" element={<SchoolManagement />} />
          <Route path="schools/new" element={<SchoolForm />} />
          <Route path="schools/view/:id" element={<AdminSchoolDetail />} />
          <Route path="schools/edit/:id" element={<SchoolForm />} />
        </Route>

        {/* 前台路由 */}
        <Route
          path="/*"
          element={
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/all-schools" element={<AllSchools />} />
                  <Route path="/data-comparison" element={<DataComparison />} />
                  <Route path="/school/:id" element={<SchoolDetail />} />
                  <Route path="/submit" element={<Submit />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
