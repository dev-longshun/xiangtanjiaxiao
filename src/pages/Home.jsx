import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SchoolCard from "../components/SchoolCard";
import { schoolAPI } from "../services/api";
import "./Home.css";

function Home() {
  const [schools, setSchools] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    loadSchools();
  }, []);

  useEffect(() => {
    let sortedSchools = [...allSchools];
    if (sortBy === "rating") {
      sortedSchools.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviewCount") {
      sortedSchools.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    setSchools(sortedSchools);
  }, [sortBy, allSchools]);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const response = await schoolAPI.getAll();
      if (response.code === 200) {
        const schoolsData = response.data || [];
        setAllSchools(schoolsData);
        const total = schoolsData.reduce(
          (sum, s) => sum + (s.reviewCount || 0),
          0
        );
        setTotalReviews(total);
      }
    } catch (error) {
      console.error("加载驾校数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">🚗 湘潭地区首选</div>
            <h1 className="hero-title">
              找到<span className="gradient-text">靠谱驾校</span>
              <br />
              避免踩坑
            </h1>
            <p className="hero-subtitle">
              真实学员评价分享平台，帮助你做出明智选择。
              <br />
              汇聚湘潭地区驾校真实反馈，让学车更放心。
            </p>
            <div className="hero-buttons">
              <Link to="/submit" className="cta-button primary">
                📝 分享你的经历
              </Link>
              <Link to="/about" className="cta-button secondary">
                了解更多
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{allSchools.length}+</div>
                <div className="stat-label">覆盖驾校</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{totalReviews}+</div>
                <div className="stat-label">真实评价</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">公益免费</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card card-1">
              <div className="card-icon">⭐</div>
              <div className="card-content">
                <div className="card-title">平均评分</div>
                <div className="card-value">4.5</div>
              </div>
            </div>
            <div className="visual-card card-2">
              <div className="card-icon">✅</div>
              <div className="card-content">
                <div className="card-title">通过率</div>
                <div className="card-value">95%</div>
              </div>
            </div>
            <div className="visual-card card-3">
              <div className="card-icon">💬</div>
              <div className="card-content">
                <div className="card-title">最新评价</div>
                <div className="card-text">"教练很耐心，一次通过！"</div>
              </div>
            </div>
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
          </div>
        </div>
      </section>

      <section className="schools-section">
        <div className="container">
          <div className="section-header">
            <h2>热门驾校推荐</h2>
            <div className="sort-controls">
              <label>排序: </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="rating">按评分</option>
                <option value="reviewCount">按评价数</option>
              </select>
            </div>
          </div>

          <div className="schools-grid">
            {loading ? (
              <div className="loading-state">加载中...</div>
            ) : (
              schools
                .slice(0, isMobile ? 3 : 6)
                .map((school) => <SchoolCard key={school.id} school={school} />)
            )}
          </div>

          {!loading && schools.length === 0 && (
            <div className="empty-state">
              <p>暂无驾校信息</p>
            </div>
          )}

          {schools.length > (isMobile ? 3 : 6) && (
            <div className="view-all-container">
              <Link to="/all-schools" className="view-all-button">
                查看全部 {schools.length} 所驾校
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <div className="info-cards">
            <div className="info-card">
              <h3>📝 真实评价</h3>
              <p>所有评价均来自真实学员投稿，真实可信</p>
            </div>
            <div className="info-card">
              <h3>🚫 避免踩坑</h3>
              <p>学员分享踩坑经验，帮助你避开不良驾校</p>
            </div>
            <div className="info-card">
              <h3>💚 公益平台</h3>
              <p>纯公益性质，不收取任何费用，不接受广告</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
