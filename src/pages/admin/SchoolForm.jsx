import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaSchool,
  FaPhone,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { schoolAPI, adminAPI } from "../../utils/api";
import "./SchoolForm.css";

/**
 * 驾校表单页面（新增/编辑）
 * 对应需求：Requirement 6.3, 6.4
 */
function SchoolForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // 有 id 则为编辑模式
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  // 表单数据
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    namePinyin: "",
    address: "",
    phone: "",
    businessHours: "",
    priceRange: "",
    description: "",
    tags: [],
    courses: [],
  });

  // 标签输入临时值
  const [tagInput, setTagInput] = useState("");
  const [courseInput, setCourseInput] = useState("");

  // 解析标签（可能是字符串或数组）
  const parseTags = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // 加载驾校数据
  const loadSchool = async () => {
    try {
      const result = await schoolAPI.getSchoolById(id);
      if (result.code === 200 && result.data) {
        const school = result.data;
        setFormData({
          id: school.id || "",
          name: school.name || "",
          namePinyin: school.namePinyin || "",
          address: school.address || "",
          phone: school.phone || "",
          businessHours: school.businessHours || "",
          priceRange: school.priceRange || "",
          description: school.description || "",
          tags: parseTags(school.tags),
          courses: parseTags(school.courses),
        });
      } else {
        setError("驾校不存在");
      }
    } catch (err) {
      console.error("加载驾校失败:", err);
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 编辑模式：加载驾校数据
  useEffect(() => {
    if (isEdit) {
      loadSchool();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 添加标签
  const addTag = (type) => {
    const input = type === "tags" ? tagInput : courseInput;
    const setInput = type === "tags" ? setTagInput : setCourseInput;

    if (!input.trim()) return;
    if (formData[type].includes(input.trim())) {
      setInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], input.trim()],
    }));
    setInput("");
  };

  // 删除标签
  const removeTag = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // 标签输入键盘事件
  const handleTagKeyDown = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(type);
    }
  };

  // 表单验证
  const validate = () => {
    const newErrors = {};

    if (!isEdit && !formData.id.trim()) {
      newErrors.id = "请输入驾校ID";
    } else if (!isEdit && !/^[a-z0-9-]+$/.test(formData.id)) {
      newErrors.id = "ID只能包含小写字母、数字和连字符";
    }

    if (!formData.name.trim()) {
      newErrors.name = "请输入驾校名称";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        tags: JSON.stringify(formData.tags),
        courses: JSON.stringify(formData.courses),
      };

      let result;
      if (isEdit) {
        result = await adminAPI.updateSchool(id, submitData);
      } else {
        result = await adminAPI.createSchool(submitData);
      }

      if (result.code === 200) {
        alert(isEdit ? "更新成功" : "创建成功");
        navigate("/admin/schools");
      } else {
        setError(result.message || "操作失败");
      }
    } catch (err) {
      console.error("提交失败:", err);
      setError("操作失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-state">加载中...</div>;
  }

  return (
    <div className="school-form-page">
      <div className="page-header">
        <Link to="/admin/schools" className="back-link">
          <FaArrowLeft /> 返回驾校列表
        </Link>
        <h1>{isEdit ? "编辑驾校" : "新增驾校"}</h1>
        <p>{isEdit ? "修改驾校信息" : "添加新的驾校到平台"}</p>
      </div>

      <div className="form-container">
        <form className="school-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          {/* 基本信息 */}
          <div className="form-section">
            <h3 className="section-title">
              <FaSchool /> 基本信息
            </h3>

            {!isEdit && (
              <div className="form-row single">
                <div className="form-group">
                  <label>
                    驾校ID<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="如：xiangtan-xxx（小写字母、数字、连字符）"
                    className={errors.id ? "error" : ""}
                  />
                  {errors.id && <span className="error-text">{errors.id}</span>}
                  <span className="form-hint">
                    ID创建后不可修改，建议使用拼音
                  </span>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>
                  驾校名称<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="请输入驾校全称"
                  className={errors.name ? "error" : ""}
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label>名称拼音</label>
                <input
                  type="text"
                  name="namePinyin"
                  value={formData.namePinyin}
                  onChange={handleChange}
                  placeholder="用于搜索排序"
                />
              </div>
            </div>
          </div>

          {/* 联系信息 */}
          <div className="form-section">
            <h3 className="section-title">
              <FaPhone /> 联系信息
            </h3>

            <div className="form-row single">
              <div className="form-group">
                <label>地址</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="请输入详细地址"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>联系电话</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="如：0731-12345678"
                />
              </div>
              <div className="form-group">
                <label>营业时间</label>
                <input
                  type="text"
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleChange}
                  placeholder="如：周一至周日 8:00-18:00"
                />
              </div>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="form-section">
            <h3 className="section-title">
              <FaInfoCircle /> 详细信息
            </h3>

            <div className="form-row single">
              <div className="form-group">
                <label>价格范围</label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  placeholder="如：3000-5000元"
                />
              </div>
            </div>

            <div className="form-row single">
              <div className="form-group">
                <label>驾校简介</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="请输入驾校简介..."
                  rows={4}
                />
              </div>
            </div>

            {/* 标签 */}
            <div className="form-row single">
              <div className="form-group">
                <label>标签</label>
                <div className="tags-input">
                  {formData.tags.map((tag, idx) => (
                    <span key={idx} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeTag("tags", idx)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="tag-input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => handleTagKeyDown(e, "tags")}
                    onBlur={() => addTag("tags")}
                    placeholder="输入标签后按回车"
                  />
                </div>
                <span className="form-hint">
                  如：大型驾校、设施完善、通过率高
                </span>
              </div>
            </div>

            {/* 课程 */}
            <div className="form-row single">
              <div className="form-group">
                <label>开设课程</label>
                <div className="tags-input">
                  {formData.courses.map((course, idx) => (
                    <span key={idx} className="tag-item">
                      {course}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeTag("courses", idx)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="tag-input"
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    onKeyDown={(e) => handleTagKeyDown(e, "courses")}
                    onBlur={() => addTag("courses")}
                    placeholder="输入课程后按回车"
                  />
                </div>
                <span className="form-hint">如：C1、C2、A1、A2</span>
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => navigate("/admin/schools")}
            >
              取消
            </button>
            <button
              type="submit"
              className="btn btn-submit"
              disabled={submitting}
            >
              {submitting ? "提交中..." : isEdit ? "保存修改" : "创建驾校"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SchoolForm;
