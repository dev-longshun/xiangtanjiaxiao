import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import SchoolCard from "../components/SchoolCard";
import { schoolAPI } from "../services/api";
import "./AllSchools.css";

function AllSchools() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);

  // 拼音映射表（常用字）
  const pinyinMap = {
    湘: "xiang",
    潭: "tan",
    平: "ping",
    安: "an",
    驾: "jia",
    校: "xiao",
    飞: "fei",
    跃: "yue",
    联: "lian",
    鸿: "hong",
    运: "yun",
    远: "yuan",
    顺: "shun",
    达: "da",
    通: "tong",
    信: "xin",
    诚: "cheng",
    成: "cheng",
    功: "gong",
    兴: "xing",
    旺: "wang",
    华: "hua",
    荣: "rong",
    盛: "sheng",
    宏: "hong",
    伟: "wei",
    大: "da",
    新: "xin",
    星: "xing",
    光: "guang",
    明: "ming",
    天: "tian",
    地: "di",
    人: "ren",
    和: "he",
    美: "mei",
    好: "hao",
    佳: "jia",
    优: "you",
    特: "te",
    超: "chao",
    强: "qiang",
    金: "jin",
    银: "yin",
    铜: "tong",
    铁: "tie",
    钢: "gang",
    龙: "long",
    凤: "feng",
    鹏: "peng",
    鹰: "ying",
    虎: "hu",
    狮: "shi",
    豹: "bao",
    马: "ma",
    牛: "niu",
    羊: "yang",
    鸡: "ji",
    犬: "quan",
    猪: "zhu",
    福: "fu",
    禄: "lu",
    寿: "shou",
    喜: "xi",
    财: "cai",
    富: "fu",
    贵: "gui",
    康: "kang",
    宁: "ning",
    泰: "tai",
    吉: "ji",
    祥: "xiang",
    瑞: "rui",
    祺: "qi",
    麒: "qi",
    麟: "lin",
    凯: "kai",
    胜: "sheng",
    利: "li",
    益: "yi",
    惠: "hui",
    民: "min",
    众: "zhong",
    国: "guo",
    中: "zhong",
    央: "yang",
    东: "dong",
    西: "xi",
    南: "nan",
    北: "bei",
    上: "shang",
    下: "xia",
    左: "zuo",
    右: "you",
    前: "qian",
    后: "hou",
    捷: "jie",
    盾: "dun",
    起: "qi",
    点: "dian",
    图: "tu",
    展: "zhan",
    望: "wang",
    方: "fang",
    建: "jian",
    设: "she",
    雨: "yu",
    湖: "hu",
    岳: "yue",
    塘: "tang",
    区: "qu",
    路: "lu",
    市: "shi",
    号: "hao",
  };

  // 汉字转拼音
  const toPinyin = (text) => {
    return text
      .split("")
      .map((char) => pinyinMap[char] || char)
      .join("");
  };

  // 页面加载时滚动到顶部并加载数据
  useEffect(() => {
    window.scrollTo(0, 0);
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const response = await schoolAPI.getAll();
      if (response.code === 200) {
        const schoolsData = response.data || [];
        const total = schoolsData.reduce(
          (sum, s) => sum + (s.reviewCount || 0),
          0
        );
        setTotalReviews(total);
        // 初始排序
        let sorted = [...schoolsData];
        if (sortBy === "rating") {
          sorted.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "reviewCount") {
          sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        }
        setSchools(sorted);
      }
    } catch (error) {
      console.error("加载驾校数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 搜索过滤
    if (!searchQuery.trim()) {
      setFilteredSchools(schools);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = schools.filter((school) => {
      const schoolName = school.name.toLowerCase();
      const schoolPinyin = toPinyin(school.name).toLowerCase();

      // 支持汉字和拼音搜索
      return schoolName.includes(query) || schoolPinyin.includes(query);
    });

    setFilteredSchools(filtered);
  }, [searchQuery, schools]);

  return (
    <div className="all-schools-page">
      <div className="container">
        <Link to="/" className="back-home-button">
          <FaArrowLeft /> 返回首页
        </Link>

        <div className="page-header">
          <div className="header-content">
            <h1>湘潭地区所有驾校</h1>
            <p className="subtitle">
              共 {schools.length} 所驾校 · {totalReviews} 条真实评价
              {searchQuery && ` · 找到 ${filteredSchools.length} 个结果`}
            </p>
          </div>
          <div className="controls-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="搜索驾校（支持拼音）..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="clear-button"
                >
                  ✕
                </button>
              )}
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
        </div>

        <div className="all-schools-grid">
          {loading ? (
            <div className="loading-state">加载中...</div>
          ) : (
            filteredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))
          )}
        </div>

        {!loading && filteredSchools.length === 0 && searchQuery && (
          <div className="empty-state">
            <p>😔 没有找到匹配 "{searchQuery}" 的驾校</p>
            <p
              style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.7 }}
            >
              试试其他关键词或拼音
            </p>
          </div>
        )}

        {!loading && schools.length === 0 && !searchQuery && (
          <div className="empty-state">
            <p>暂无驾校信息</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllSchools;
