import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllSchools from './pages/AllSchools';
import DataComparison from './pages/DataComparison';
import SchoolDetail from './pages/SchoolDetail';
import Submit from './pages/Submit';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
