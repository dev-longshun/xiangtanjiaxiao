import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaChartLine, FaUsers } from 'react-icons/fa';
import data from '../data/data.json';
import './DataComparison.css';

function DataComparison() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 按总通过率排序
    const sorted = [...data.schools].sort((a, b) => 
      b.examData.overall - a.examData.overall
    );
    setSchools(sorted);
  }, []);

  const getOverallStats = () => {
    const totalStudents = schools.reduce((sum, s) => sum + s.examData.totalStudents, 0);
    const totalPassed = schools.reduce((sum, s) => sum + s.examData.passedStudents, 0);
    const avgRate = ((totalPassed / totalStudents) * 100).toFixed(1);
    
    return { totalStudents, totalPassed, avgRate };
  };

  const stats = getOverallStats();

  return (
    <div className="data-comparison-page">
      <div className="container">
        <Link to="/" className="back-button">
          <FaArrowLeft /> 返回首页
        </Link>

        <div className="page-title">
          <h1>🎯 驾校数据统计中心</h1>
          <p>基于真实考试数据的智能分析系统</p>
        </div>

        {/* 整体统计卡片 */}
        <div className="stats-overview">
          <div className="stat-card card-primary">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <div className="stat-label">累计培训学员</div>
              <div className="stat-value" data-value={stats.totalStudents}>{stats.totalStudents}</div>
            </div>
            <div className="stat-glow"></div>
          </div>

          <div className="stat-card card-success">
            <div className="stat-icon">
              <FaTrophy />
            </div>
            <div className="stat-content">
              <div className="stat-label">成功拿证学员</div>
              <div className="stat-value" data-value={stats.totalPassed}>{stats.totalPassed}</div>
            </div>
            <div className="stat-glow"></div>
          </div>

          <div className="stat-card card-warning">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <div className="stat-label">平均通过率</div>
              <div className="stat-value">{stats.avgRate}%</div>
            </div>
            <div className="stat-glow"></div>
          </div>
        </div>

        {/* 综合通过率对比 */}
        <div className="comparison-section">
          <h2>📊 所有驾校通过率对比</h2>
          <div className="chart-container">
            {schools.map((school, index) => {
              const maxRate = Math.max(...schools.map(s => s.examData.overall));
              const percentage = (school.examData.overall / maxRate) * 100;
              
              return (
                <div key={school.id} className="chart-row" style={{animationDelay: `${index * 0.02}s`}}>
                  <div className="chart-label">
                    <span className="school-rank">#{index + 1}</span>
                    <span className="school-name-text">{school.name}</span>
                  </div>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{width: `${percentage}%`, animationDelay: `${index * 0.02}s`}}
                      data-value={school.examData.overall}
                    >
                      <span className="bar-value">{school.examData.overall}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 科目通过率对比 */}
        <div className="subjects-section">
          <h2>📚 各科目通过率TOP5</h2>
          <div className="subjects-grid">
            {['subject1', 'subject2', 'subject3', 'subject4'].map((subject) => {
              const subjectNames = {
                subject1: '科目一',
                subject2: '科目二',
                subject3: '科目三',
                subject4: '科目四'
              };
              
              // 按该科目排序，只取前5名
              const topSchools = [...schools].sort((a, b) => 
                b.examData[subject] - a.examData[subject]
              ).slice(0, 5);
              
              return (
                <div key={subject} className="subject-card">
                  <h3>{subjectNames[subject]}</h3>
                  <div className="subject-bars">
                    {topSchools.map((school) => (
                      <div key={school.id} className="subject-bar-item">
                        <div className="subject-school-name">{school.name}</div>
                        <div className="subject-bar-wrapper">
                          <div 
                            className="subject-bar" 
                            style={{width: `${school.examData[subject]}%`}}
                          >
                            <span className="subject-bar-label">{school.examData[subject]}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 详细数据表格 */}
        <div className="table-section">
          <h2>📋 完整数据表格</h2>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>驾校名称</th>
                  <th>科目一</th>
                  <th>科目二</th>
                  <th>科目三</th>
                  <th>科目四</th>
                  <th>综合通过率</th>
                  <th>培训学员</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school, index) => (
                  <tr key={school.id} style={{animationDelay: `${index * 0.015}s`}}>
                    <td>
                      <div className="rank-badge">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </div>
                    </td>
                    <td className="school-name-cell">{school.name}</td>
                    <td>{school.examData.subject1}%</td>
                    <td>{school.examData.subject2}%</td>
                    <td>{school.examData.subject3}%</td>
                    <td>{school.examData.subject4}%</td>
                    <td className="overall-cell">{school.examData.overall}%</td>
                    <td>{school.examData.totalStudents}人</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataComparison;

