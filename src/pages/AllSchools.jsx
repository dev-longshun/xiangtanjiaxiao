import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import SchoolCard from '../components/SchoolCard';
import data from '../data/data.json';
import './AllSchools.css';

function AllSchools() {
  const [schools, setSchools] = useState([]);
  const [sortBy, setSortBy] = useState('rating'); // rating or reviewCount

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // 加载并排序驾校数据
    let sortedSchools = [...data.schools];
    
    if (sortBy === 'rating') {
      sortedSchools.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviewCount') {
      sortedSchools.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    
    setSchools(sortedSchools);
  }, [sortBy]);

  return (
    <div className="all-schools-page">
      <div className="container">
        <Link to="/" className="back-home-button">
          <FaArrowLeft /> 返回首页
        </Link>

        <div className="page-header">
          <div className="header-content">
            <h1>湘潭地区所有驾校</h1>
            <p className="subtitle">共 {schools.length} 所驾校 · {data.reviews.length} 条真实评价</p>
          </div>
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

        <div className="all-schools-grid">
          {schools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>

        {schools.length === 0 && (
          <div className="empty-state">
            <p>暂无驾校信息</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllSchools;

