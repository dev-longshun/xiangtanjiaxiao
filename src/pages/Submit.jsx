import { useEffect } from 'react';
import { FaQq, FaEnvelope, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import data from '../data/data.json';
import './Submit.css';

function Submit() {
  const contact = data.contact;

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="submit-page">
      <div className="container">
        <div className="submit-header">
          <h1>投稿说明</h1>
          <p className="subtitle">分享你的真实学车经历，帮助更多学员选择靠谱驾校</p>
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

        <div className="submit-cta">
          <p className="cta-text">你的真实评价将帮助更多学员做出正确选择！</p>
          <div className="cta-buttons">
            <a href={`tencent://message/?uin=${contact.qq}`} className="cta-button primary">
              <FaQq /> 通过QQ投稿
            </a>
            <a href={`mailto:${contact.email}`} className="cta-button secondary">
              <FaEnvelope /> 通过邮箱投稿
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Submit;

