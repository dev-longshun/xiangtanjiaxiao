import { FaHeart, FaShieldAlt, FaUsers, FaEdit } from 'react-icons/fa';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>关于我们</h1>
          <p className="subtitle">一个由学员为学员打造的驾校评价平台</p>
        </div>

        <section className="about-section">
          <div className="section-icon-wrapper">
            <FaHeart className="section-icon" />
          </div>
          <h2>平台简介</h2>
          <div className="content-box">
            <p>
              湘潭驾校评价网是一个纯公益性质的驾校信息分享平台，旨在为湘潭地区的学员提供真实、客观的驾校评价信息。
            </p>
            <p>
              我们深知选择一个好的驾校对学车体验的重要性。通过收集真实学员的评价和经验分享，
              我们希望帮助更多人避免踩坑，选择到适合自己的驾校。
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="section-icon-wrapper">
            <FaUsers className="section-icon" />
          </div>
          <h2>服务对象</h2>
          <div className="content-box">
            <ul className="service-list">
              <li>
                <strong>准备学车的朋友</strong>
                <p>通过真实评价，了解各驾校的优缺点，做出明智选择</p>
              </li>
              <li>
                <strong>正在学车的学员</strong>
                <p>分享你的学车经历，帮助他人少走弯路</p>
              </li>
              <li>
                <strong>已经拿证的学员</strong>
                <p>回顾学车过程，给后来者提供参考意见</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="about-section">
          <div className="section-icon-wrapper">
            <FaEdit className="section-icon" />
          </div>
          <h2>运营机制</h2>
          <div className="content-box">
            <h3>📥 内容来源</h3>
            <p>
              网站上的所有评价均来自学员通过QQ或邮箱的真实投稿。我们不接受任何形式的付费推广，
              确保每一条评价都是学员的真实声音。
            </p>

            <h3>✅ 审核机制</h3>
            <p>
              收到投稿后，管理员会进行人工审核，确保内容真实、客观、文明。
              通过审核的评价会被手动添加到网站数据库中。
            </p>

            <h3>🔄 更新方式</h3>
            <p>
              为了降低运营成本，本网站采用静态页面 + JSON数据的技术方案。
              管理员通过命令行工具手动更新数据，保证信息的及时性和准确性。
            </p>

            <h3>⏱️ 更新频率</h3>
            <p>
              通常情况下，审核通过的投稿会在1-3个工作日内发布到网站上。
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="section-icon-wrapper">
            <FaShieldAlt className="section-icon" />
          </div>
          <h2>免责声明</h2>
          <div className="content-box disclaimer">
            <ul>
              <li>本平台仅作为信息分享平台，不对任何驾校进行推荐或背书</li>
              <li>所有评价均为学员个人观点，不代表平台立场</li>
              <li>用户应结合自身情况理性判断，我们不对学员的选择承担责任</li>
              <li>如发现评价内容与事实严重不符，请及时联系我们核实处理</li>
              <li>本平台不会收集用户的个人隐私信息</li>
              <li>投稿内容版权归原作者所有，平台仅作展示使用</li>
            </ul>
          </div>
        </section>

        <section className="about-section">
          <h2>联系我们</h2>
          <div className="content-box contact">
            <p>如果你有任何问题、建议或想要投稿，欢迎通过以下方式联系我们：</p>
            <div className="contact-info">
              <p><strong>QQ:</strong> 123456789</p>
              <p><strong>邮箱:</strong> xiangtan-jiaxiao@qq.com</p>
            </div>
          </div>
        </section>

        <div className="about-footer">
          <p className="thanks">
            感谢每一位投稿的学员，你们的分享让这个平台更有价值！
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;

