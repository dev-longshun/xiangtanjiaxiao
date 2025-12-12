import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { schoolAPI, reviewAPI, uploadAPI } from '../utils/api';
import './Submit.css';

function Submit() {
  const navigate = useNavigate();

  // 表单数据状态
  const [formData, setFormData] = useState({
    schoolId: '',
    author: '',
    content: '',
    rating: 0,
    evidenceImages: []
  });

  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchMode, setSearchMode] = useState(true);  // 默认使用搜索模式，避免原生select样式问题
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);  // 图片上传中状态

  // 页面加载时滚动到顶部并加载驾校列表
  useEffect(() => {
    window.scrollTo(0, 0);
    loadSchools();
    
    // 自动填充当前用户昵称
    const nickname = localStorage.getItem('nickname');
    if (nickname) {
      setFormData(prev => ({
        ...prev,
        author: nickname
      }));
    }
  }, []);

  // 加载驾校列表
  const loadSchools = async () => {
    try {
      const result = await schoolAPI.getAllSchools();
      if (result.code === 200) {
        setSchools(result.data || []);
        setFilteredSchools(result.data || []);
      }
    } catch (err) {
      console.error('加载驾校列表失败:', err);
    }
  };

  // 处理输入框变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 处理评分选择
  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  // 处理驾校搜索
  const handleSchoolSearch = (keyword) => {
    setSearchKeyword(keyword);
    if (!keyword.trim()) {
      setFilteredSchools(schools);
      return;
    }
    const filtered = schools.filter(school => 
      school.name.toLowerCase().includes(keyword.toLowerCase()) ||
      school.namePinyin?.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredSchools(filtered);
  };

  // 切换搜索模式
  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    setSearchKeyword('');
    setFilteredSchools(schools);
  };

  // 处理图片选择
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // 检查图片数量限制
    if (formData.evidenceImages.length + files.length > 9) {
      setError('最多只能上传9张图片');
      return;
    }

    // 检查文件大小和类型
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`图片 ${file.name} 超过5MB，请压缩后上传`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError(`文件 ${file.name} 不是图片格式`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    // 上传图片
    setUploading(true);
    setError('');

    try {
      const uploadPromises = validFiles.map(file => uploadAPI.uploadImage(file));
      const results = await Promise.all(uploadPromises);

      // 提取成功上传的图片URL
      const newUrls = results
        .filter(result => result.code === 200)
        .map(result => result.data);

      if (newUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          evidenceImages: [...prev.evidenceImages, ...newUrls]
        }));
      }

      if (newUrls.length < validFiles.length) {
        setError('部分图片上传失败，请重试');
      }
    } catch (err) {
      console.error('图片上传失败:', err);
      setError('图片上传失败，请检查网络后重试');
    } finally {
      setUploading(false);
      // 清空input，允许重复选择同一文件
      e.target.value = '';
    }
  };

  // 删除图片
  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      evidenceImages: prev.evidenceImages.filter((_, i) => i !== index)
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // TODO: 表单验证
    // TODO: 调用提交接口
    console.log('表单数据:', formData);
  };

  return (
    <div className="submit-page">
      <div className="container">
        <div className="submit-header">
          <h1>提交评价</h1>
          <p className="subtitle">分享你的真实学车经历，帮助更多学员选择靠谱驾校</p>
        </div>

        {/* 在线提交表单 */}
        <section className="online-form-section">
          <h2>📝 在线提交</h2>
          <div className="form-container">
            <form className="submit-form" onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              
              {/* 驾校选择 */}
              <div className="form-group">
                <label>
                  选择驾校<span className="required">*</span>
                  <button 
                    type="button" 
                    className="toggle-search-btn"
                    onClick={toggleSearchMode}
                  >
                    {searchMode ? '切换到下拉选择' : '切换到搜索模式'}
                  </button>
                </label>
                
                {!searchMode ? (
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    className={errors.schoolId ? 'error' : ''}
                  >
                    <option value="">请选择驾校</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      placeholder="输入驾校名称搜索..."
                      value={searchKeyword}
                      onChange={(e) => handleSchoolSearch(e.target.value)}
                      className={errors.schoolId ? 'error' : ''}
                    />
                    {searchKeyword && filteredSchools.length > 0 && (
                      <div className="search-results">
                        {filteredSchools.map(school => (
                          <div
                            key={school.id}
                            className="search-result-item"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, schoolId: school.id }));
                              setSearchKeyword(school.name);
                              setFilteredSchools([]);
                            }}
                          >
                            {school.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {errors.schoolId && <span className="error-text">{errors.schoolId}</span>}
              </div>

              {/* 昵称输入 */}
              <div className="form-group">
                <label>
                  评价者昵称<span className="required">*</span>
                  <span className="hint">使用当前账户昵称</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  readOnly
                  className={`readonly ${errors.author ? 'error' : ''}`}
                  placeholder="请先登录"
                />
                {errors.author && <span className="error-text">{errors.author}</span>}
              </div>

              {/* 评分选择 */}
              <div className="form-group">
                <label>
                  综合评分<span className="required">*</span>
                </label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${formData.rating >= star ? 'active' : ''}`}
                      onClick={() => handleRatingChange(star)}
                    >
                      ★
                    </span>
                  ))}
                  <span className="rating-text">
                    {formData.rating > 0 ? `${formData.rating} 星` : '请选择评分'}
                  </span>
                </div>
                {errors.rating && <span className="error-text">{errors.rating}</span>}
              </div>

              {/* 评价内容 */}
              <div className="form-group">
                <label>
                  评价内容<span className="required">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="请详细描述你在该驾校的学车体验：&#10;- 教练的教学态度和水平&#10;- 练车的便利性和场地情况&#10;- 收费是否透明，有无隐形消费&#10;- 考试通过情况&#10;- 其他想要提醒后来学员的事项"
                  className={errors.content ? 'error' : ''}
                  rows="8"
                />
                {errors.content && <span className="error-text">{errors.content}</span>}
              </div>

              {/* 图片上传 */}
              <div className="form-group">
                <label>
                  上传图片证明（可选）
                  <span className="hint">最多9张，每张不超过5MB</span>
                </label>
                
                <div className="image-upload-area">
                  {/* 图片预览 */}
                  {formData.evidenceImages.length > 0 && (
                    <div className="image-preview-list">
                      {formData.evidenceImages.map((url, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={url} alt={`证明图片${index + 1}`} />
                          <button
                            type="button"
                            className="image-remove-btn"
                            onClick={() => handleImageRemove(index)}
                            title="删除图片"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 上传按钮 */}
                  {formData.evidenceImages.length < 9 && (
                    <label className="image-upload-btn">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        disabled={uploading}
                        style={{ display: 'none' }}
                      />
                      <div className="upload-btn-content">
                        {uploading ? (
                          <>
                            <span className="upload-icon">⏳</span>
                            <span>上传中...</span>
                          </>
                        ) : (
                          <>
                            <span className="upload-icon">📷</span>
                            <span>点击上传图片</span>
                            <span className="upload-hint">
                              {formData.evidenceImages.length}/9 张
                            </span>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                </div>
                
                <p className="form-hint">
                  💡 上传学费收据、聊天记录等图片可提高评价可信度
                </p>
              </div>

              <button type="submit" className="submit-btn" disabled={loading || uploading}>
                {loading ? '提交中...' : '提交评价'}
              </button>
            </form>
          </div>
        </section>

        {/* 保留原有的投稿流程说明 */}
        <section className="process-section">
          <h2>📋 投稿流程</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>填写表单</h3>
                <p>使用上方表单填写评价内容</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>提交审核</h3>
                <p>点击提交按钮发送评价</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>等待审核</h3>
                <p>管理员会在1-3个工作日内审核</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>内容上线</h3>
                <p>审核通过后，你的评价会出现在网站上</p>
              </div>
            </div>
          </div>
        </section>

        <section className="template-section">
          <h2>📋 评价参考模板</h2>
          <div className="template-box">
            <pre className="template-content">{`【驾校名称】: 
【学员昵称】: （可以匿名）
【评分】: ⭐⭐⭐⭐⭐ (1-5星)
【评价内容】: 
请详细描述你在该驾校的学车体验，包括：
- 教练的教学态度和水平
- 练车的便利性和场地情况
- 收费是否透明，有无隐形消费
- 考试通过情况
- 其他想要提醒后来学员的事项

【评价类型】: 
□ 优质评价  □ 中肯评价  □ 踩坑经验`}</pre>
          </div>
        </section>

        <section className="guidelines-section">
          <h2>
            <FaCheckCircle className="section-icon success" />
            投稿要求
          </h2>
          <ul className="guidelines-list positive">
            <li>内容真实，基于个人真实学车经历</li>
            <li>评价客观，尽量全面描述优缺点</li>
            <li>语言文明，不使用侮辱性词汇</li>
            <li>信息完整，包含驾校名称和评价内容</li>
            <li>原创内容，不抄袭他人评价</li>
          </ul>
        </section>

        <section className="guidelines-section warning">
          <h2>
            <FaExclamationTriangle className="section-icon warning" />
            注意事项
          </h2>
          <ul className="guidelines-list warning">
            <li>我们会对所有投稿进行审核，不符合要求的内容不会发布</li>
            <li>恶意诋毁、虚假宣传等内容将被拒绝</li>
            <li>投稿时请保持理性，避免过度情绪化表达</li>
            <li>个人隐私信息（如真实姓名、身份证号等）会被处理</li>
            <li>本平台为公益性质，不接受任何形式的付费推广</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Submit;

