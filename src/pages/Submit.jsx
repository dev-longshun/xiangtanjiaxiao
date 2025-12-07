import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaQq,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { schoolAPI, reviewAPI, uploadAPI } from "../services/api";
import "./Submit.css";

function Submit() {
  const { user, isAuthenticated } = useAuth();
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    schoolId: "",
    rating: 0,
    content: "",
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const contact = {
    qq: "123456789",
    email: "xiangtan-jiaxiao@qq.com",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const response = await schoolAPI.getAll();
      if (response.code === 200) {
        setSchools(response.data || []);
      }
    } catch (error) {
      console.error("加载驾校列表失败:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 9) {
      setMessage({ type: "error", text: "最多上传9张图片" });
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setMessage({ type: "error", text: `图片 ${file.name} 超过5MB限制` });
          continue;
        }
        const response = await uploadAPI.uploadImage(file);
        if (response.code === 200) {
          setImages((prev) => [...prev, response.data]);
        }
      }
    } catch {
      setMessage({ type: "error", text: "图片上传失败" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.schoolId) {
      setMessage({ type: "error", text: "请选择驾校" });
      return;
    }
    if (formData.rating === 0) {
      setMessage({ type: "error", text: "请选择评分" });
      return;
    }
    if (formData.content.length < 10 || formData.content.length > 500) {
      setMessage({ type: "error", text: "评价内容需在10-500字之间" });
      return;
    }

    setSubmitting(true);
    try {
      const review = {
        schoolId: formData.schoolId,
        author: user.nickname,
        rating: formData.rating,
        content: formData.content,
        evidenceImages: images,
      };
      const response = await reviewAPI.submit(review);
      if (response.code === 200) {
        setMessage({ type: "success", text: "投稿成功，等待管理员审核" });
        setFormData({ schoolId: "", rating: 0, content: "" });
        setImages([]);
      } else {
        setMessage({ type: "error", text: response.message || "投稿失败" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "投稿失败" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="container">
        <div className="submit-header">
          <h1>投稿说明</h1>
          <p className="subtitle">
            分享你的真实学车经历，帮助更多学员选择靠谱驾校
          </p>
        </div>

        <section className="contact-section">
          <h2>📮 投稿方式</h2>
          <div className="contact-cards">
            <div className="contact-card">
              <FaQq className="contact-icon-large" />
              <h3>QQ联系</h3>
              <p className="contact-value">{contact.qq}</p>
              <p className="contact-desc">添加QQ好友后直接发送投稿内容</p>
            </div>
            <div className="contact-card">
              <FaEnvelope className="contact-icon-large" />
              <h3>邮箱投稿</h3>
              <p className="contact-value">{contact.email}</p>
              <p className="contact-desc">发送邮件到上述邮箱</p>
            </div>
          </div>
        </section>

        <section className="process-section">
          <h2>📝 投稿流程</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>准备内容</h3>
                <p>根据下方模板整理你的评价内容</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>联系管理员</h3>
                <p>通过QQ或邮箱将内容发送给我们</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>等待审核</h3>
                <p>管理员会在1-3个工作日内审核并发布</p>
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
          <h2>📋 投稿模板</h2>
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

        {/* 在线投稿表单 */}
        <section className="online-submit-section">
          <h2>📝 在线投稿</h2>
          {!isAuthenticated() ? (
            <div className="login-prompt">
              <p>请先登录后再投稿</p>
              <div className="login-buttons">
                <Link to="/login" className="login-btn">
                  登录
                </Link>
                <Link to="/register" className="register-btn">
                  注册
                </Link>
              </div>
            </div>
          ) : (
            <form className="submit-form" onSubmit={handleSubmit}>
              {message.text && (
                <div className={`form-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="form-group">
                <label>选择驾校 *</label>
                <select
                  value={formData.schoolId}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolId: e.target.value })
                  }
                  disabled={submitting}
                >
                  <option value="">请选择驾校</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>评分 *</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star-btn ${
                        formData.rating >= star ? "active" : ""
                      }`}
                      onClick={() =>
                        !submitting &&
                        setFormData({ ...formData, rating: star })
                      }
                    />
                  ))}
                  <span className="rating-text">
                    {formData.rating > 0 ? `${formData.rating} 星` : "点击选择"}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>评价内容 * (10-500字)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="请详细描述你在该驾校的学车体验..."
                  rows={6}
                  disabled={submitting}
                />
                <span className="char-count">
                  {formData.content.length}/500
                </span>
              </div>

              <div className="form-group">
                <label>上传证明图片 (可选，最多9张)</label>
                <div className="image-upload-area">
                  {images.map((url, index) => (
                    <div key={index} className="image-preview">
                      <img src={url} alt={`证明图片${index + 1}`} />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeImage(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  {images.length < 9 && (
                    <label className="upload-btn">
                      <FaUpload />
                      <span>{uploading ? "上传中..." : "添加图片"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading || submitting}
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "提交中..." : "提交投稿"}
              </button>
            </form>
          )}
        </section>

        <div className="submit-cta">
          <p className="cta-text">也可以通过以下方式投稿：</p>
          <div className="cta-buttons">
            <a
              href={`tencent://message/?uin=${contact.qq}`}
              className="cta-button primary"
            >
              <FaQq /> 通过QQ投稿
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="cta-button secondary"
            >
              <FaEnvelope /> 通过邮箱投稿
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Submit;
