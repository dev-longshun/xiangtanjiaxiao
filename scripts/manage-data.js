import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/data.json');

// 读取数据
function loadData() {
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('❌ 读取数据失败:', error.message);
    process.exit(1);
  }
}

// 保存数据
function saveData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('✅ 数据保存成功！');
  } catch (error) {
    console.error('❌ 保存数据失败:', error.message);
  }
}

// 生成唯一ID
function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
}

// 计算驾校平均评分
function calculateSchoolRating(data, schoolId) {
  const reviews = data.reviews.filter(r => r.schoolId === schoolId);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

// 更新驾校评价数量
function updateSchoolReviewCount(data, schoolId) {
  const school = data.schools.find(s => s.id === schoolId);
  if (school) {
    school.reviewCount = data.reviews.filter(r => r.schoolId === schoolId).length;
    school.rating = calculateSchoolRating(data, schoolId);
  }
}

// 添加新驾校
async function addSchool() {
  console.log('\n📝 添加新驾校\n');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '驾校名称:',
      validate: input => input.trim() !== '' || '驾校名称不能为空'
    },
    {
      type: 'input',
      name: 'address',
      message: '驾校地址:',
      validate: input => input.trim() !== '' || '地址不能为空'
    },
    {
      type: 'input',
      name: 'phone',
      message: '联系电话:',
      validate: input => input.trim() !== '' || '电话不能为空'
    },
    {
      type: 'input',
      name: 'description',
      message: '驾校简介:',
      validate: input => input.trim() !== '' || '简介不能为空'
    },
    {
      type: 'input',
      name: 'courses',
      message: '培训课程 (用逗号分隔，如: C1,C2):',
      default: 'C1,C2'
    },
    {
      type: 'input',
      name: 'tags',
      message: '驾校特色标签 (用逗号分隔):',
      default: ''
    }
  ]);

  const data = loadData();
  
  const newSchool = {
    id: generateId('school'),
    name: answers.name.trim(),
    address: answers.address.trim(),
    phone: answers.phone.trim(),
    description: answers.description.trim(),
    rating: 0,
    reviewCount: 0,
    tags: answers.tags ? answers.tags.split(',').map(t => t.trim()).filter(t => t) : [],
    courses: answers.courses.split(',').map(c => c.trim()).filter(c => c)
  };

  data.schools.push(newSchool);
  saveData(data);
  
  console.log('\n✅ 驾校添加成功！');
  console.log(`驾校ID: ${newSchool.id}`);
}

// 添加新评价
async function addReview() {
  console.log('\n📝 添加新评价\n');
  
  const data = loadData();
  
  if (data.schools.length === 0) {
    console.log('❌ 还没有任何驾校，请先添加驾校！');
    return;
  }

  const schoolChoices = data.schools.map(s => ({
    name: `${s.name} (${s.id})`,
    value: s.id
  }));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'schoolId',
      message: '选择驾校:',
      choices: schoolChoices
    },
    {
      type: 'input',
      name: 'author',
      message: '学员昵称:',
      default: '匿名学员'
    },
    {
      type: 'number',
      name: 'rating',
      message: '评分 (1-5星):',
      validate: input => (input >= 1 && input <= 5) || '评分必须在1-5之间',
      default: 5
    },
    {
      type: 'editor',
      name: 'content',
      message: '评价内容 (将打开编辑器):',
      validate: input => input.trim() !== '' || '评价内容不能为空'
    },
    {
      type: 'checkbox',
      name: 'tags',
      message: '评价类型 (可多选):',
      choices: [
        { name: '优质评价', value: '优质评价' },
        { name: '中肯评价', value: '中肯评价' },
        { name: '踩坑经验', value: '踩坑经验' }
      ]
    },
    {
      type: 'input',
      name: 'date',
      message: '评价日期 (YYYY-MM-DD):',
      default: new Date().toISOString().split('T')[0],
      validate: input => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(input) || '日期格式不正确，请使用 YYYY-MM-DD 格式';
      }
    }
  ]);

  const newReview = {
    id: generateId('review'),
    schoolId: answers.schoolId,
    author: answers.author.trim(),
    content: answers.content.trim(),
    rating: answers.rating,
    date: answers.date,
    tags: answers.tags.length > 0 ? answers.tags : ['中肯评价']
  };

  data.reviews.push(newReview);
  updateSchoolReviewCount(data, answers.schoolId);
  saveData(data);
  
  console.log('\n✅ 评价添加成功！');
  console.log(`评价ID: ${newReview.id}`);
}

// 编辑驾校信息
async function editSchool() {
  console.log('\n✏️ 编辑驾校信息\n');
  
  const data = loadData();
  
  if (data.schools.length === 0) {
    console.log('❌ 还没有任何驾校！');
    return;
  }

  const schoolChoices = data.schools.map(s => ({
    name: `${s.name} (${s.id})`,
    value: s.id
  }));

  const { schoolId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'schoolId',
      message: '选择要编辑的驾校:',
      choices: schoolChoices
    }
  ]);

  const school = data.schools.find(s => s.id === schoolId);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '驾校名称:',
      default: school.name
    },
    {
      type: 'input',
      name: 'address',
      message: '驾校地址:',
      default: school.address
    },
    {
      type: 'input',
      name: 'phone',
      message: '联系电话:',
      default: school.phone
    },
    {
      type: 'input',
      name: 'description',
      message: '驾校简介:',
      default: school.description
    },
    {
      type: 'input',
      name: 'courses',
      message: '培训课程 (用逗号分隔):',
      default: school.courses.join(',')
    },
    {
      type: 'input',
      name: 'tags',
      message: '驾校特色标签 (用逗号分隔):',
      default: school.tags.join(',')
    }
  ]);

  school.name = answers.name.trim();
  school.address = answers.address.trim();
  school.phone = answers.phone.trim();
  school.description = answers.description.trim();
  school.courses = answers.courses.split(',').map(c => c.trim()).filter(c => c);
  school.tags = answers.tags ? answers.tags.split(',').map(t => t.trim()).filter(t => t) : [];

  saveData(data);
  console.log('\n✅ 驾校信息更新成功！');
}

// 删除评价
async function deleteReview() {
  console.log('\n🗑️ 删除评价\n');
  
  const data = loadData();
  
  if (data.reviews.length === 0) {
    console.log('❌ 还没有任何评价！');
    return;
  }

  const reviewChoices = data.reviews.map(r => {
    const school = data.schools.find(s => s.id === r.schoolId);
    return {
      name: `${school?.name || '未知驾校'} - ${r.author} - ${r.date} (${r.id})`,
      value: r.id
    };
  });

  const { reviewId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'reviewId',
      message: '选择要删除的评价:',
      choices: reviewChoices
    }
  ]);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '确定要删除这条评价吗？',
      default: false
    }
  ]);

  if (confirm) {
    const review = data.reviews.find(r => r.id === reviewId);
    const schoolId = review.schoolId;
    
    data.reviews = data.reviews.filter(r => r.id !== reviewId);
    updateSchoolReviewCount(data, schoolId);
    saveData(data);
    
    console.log('\n✅ 评价删除成功！');
  } else {
    console.log('\n❌ 已取消删除操作');
  }
}

// 查看统计信息
function viewStats() {
  console.log('\n📊 统计信息\n');
  
  const data = loadData();
  
  console.log(`驾校总数: ${data.schools.length}`);
  console.log(`评价总数: ${data.reviews.length}`);
  console.log('');
  
  if (data.schools.length > 0) {
    console.log('各驾校评价情况:');
    data.schools.forEach(school => {
      const reviewCount = data.reviews.filter(r => r.schoolId === school.id).length;
      console.log(`  - ${school.name}: ${reviewCount} 条评价，评分 ${school.rating.toFixed(1)}`);
    });
  }
  
  console.log('');
}

// 主菜单
async function mainMenu() {
  console.clear();
  console.log('╔════════════════════════════════════╗');
  console.log('║   湘潭驾校评价网 - 数据管理工具   ║');
  console.log('╚════════════════════════════════════╝\n');

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '请选择操作:',
      choices: [
        { name: '📝 添加新驾校', value: 'addSchool' },
        { name: '💬 添加新评价', value: 'addReview' },
        { name: '✏️  编辑驾校信息', value: 'editSchool' },
        { name: '🗑️  删除评价', value: 'deleteReview' },
        { name: '📊 查看统计信息', value: 'viewStats' },
        { name: '🚪 退出', value: 'exit' }
      ]
    }
  ]);

  switch (action) {
    case 'addSchool':
      await addSchool();
      break;
    case 'addReview':
      await addReview();
      break;
    case 'editSchool':
      await editSchool();
      break;
    case 'deleteReview':
      await deleteReview();
      break;
    case 'viewStats':
      viewStats();
      break;
    case 'exit':
      console.log('\n👋 再见！\n');
      process.exit(0);
  }

  // 继续显示菜单
  const { continueAction } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continueAction',
      message: '是否继续其他操作？',
      default: true
    }
  ]);

  if (continueAction) {
    await mainMenu();
  } else {
    console.log('\n👋 再见！\n');
    process.exit(0);
  }
}

// 启动程序
mainMenu().catch(error => {
  console.error('❌ 发生错误:', error.message);
  process.exit(1);
});

