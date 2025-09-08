const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 配置（生产环境建议从环境变量读取）
const SECRET_KEY = process.env.JWT_SECRET; // 密钥至少256位
const EXPIRES_IN = process.env.EXPIRES_IN; // Token有效期（2小时）
console.log(SECRET_KEY)
console.log(EXPIRES_IN)
/**
 * 生成JWT Token
 * @param {Object} payload - 存储在Token中的数据（避免敏感信息）
 * @returns {string} 生成的Token字符串
 */
function generateToken(payload) {
  try {
    // 签名并生成Token
    const token = jwt.sign(
      payload, // 要存储的数据（如用户ID、角色）
      SECRET_KEY, // 密钥
      { expiresIn: EXPIRES_IN } // 过期时间
    );
    return token;
  } catch (error) {
    console.error('生成Token失败:', error);
    throw new Error('Token生成失败');
  }
}
// 初始化Express应用
const app = express();
const PORT = 3001;

// 数据存储文件路径
const STORAGE_FILE = path.join(__dirname, 'storage.json');

// 模拟localStorage的内存存储对象
let localStorage = {
  courses: [],
  purchases: [],
  courseContent: []
};

// 初始化存储 - 从文件加载数据
async function initStorage() {
  try {
    // 检查文件是否存在
    await fs.access(STORAGE_FILE);
    // 读取文件内容
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    // 解析JSON数据
    localStorage = JSON.parse(data);
    console.log('数据加载成功');
  } catch (error) {
    // 如果文件不存在或读取失败，使用初始数据
    console.log('使用初始数据，将创建新的存储文件');
    await saveStorage(); // 创建新文件
  }
}

// 保存数据到文件 - 模拟localStorage的持久化
async function saveStorage() {
  try {
    await fs.writeFile(STORAGE_FILE, JSON.stringify(localStorage, null, 2));
    // console.log('数据已保存');
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

// 模拟localStorage的方法
const storage = {
  getItem: (key) => {
    return localStorage[key] || [];
  },
  
  setItem: async (key, value) => {
    localStorage[key] = value;
    await saveStorage();
  },
  
  clear: async () => {
    localStorage = {
      courses: [],
      purchases: [],
      courseContent: []
    };
    await saveStorage();
  }
};

// 中间件
app.use(cors());
app.use(bodyParser.json());

// API路由

// 获取所有课程
app.get('/api/courses', async (req, res) => {
  try {
    const courses = storage.getItem('courses');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// 获取单个课程
app.get('/api/courses/:id', async (req, res) => {
  try {
    const courses = storage.getItem('courses');
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// 保存课程
app.post('/api/courses', async (req, res) => {
  try {
    const courses = storage.getItem('courses');
    const existingIndex = courses.findIndex(c => c.id === req.body.id);
    
    if (existingIndex !== -1) {
      // 更新现有课程
      courses[existingIndex] = req.body;
    } else {
      // 添加新课程
      courses.push(req.body);
    }
    
    await storage.setItem('courses', courses);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save course' });
  }
});

// 记录购买信息
app.post('/api/purchases', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'User ID and Course ID are required' });
    }
    
    const purchases = storage.getItem('purchases');
    
    // 检查是否已购买
    const existingPurchase = purchases.find(
      p => p.userId === userId && p.courseId === courseId
    );
    
    if (existingPurchase) {
      return res.json(existingPurchase);
    }
    
    // 创建新购买记录
    const purchase = {
      id: Date.now().toString(),
      userId,
      courseId,
      purchasedAt: new Date().toISOString()
    };
    
    purchases.push(purchase);
    await storage.setItem('purchases', purchases);
    
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record purchase' });
  }
});

// 检查用户是否购买了课程
app.get('/api/purchases/check', async (req, res) => {
  try {
    const { userId, courseId } = req.query;
    
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'User ID and Course ID are required' });
    }
    
    const purchases = storage.getItem('purchases');
    
    const purchase = purchases.find(
      p => p.userId === userId && p.courseId === courseId
    );
    
    res.json({ purchased: !!purchase });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check purchase status' });
  }
});

// 获取用户购买的所有课程
app.get('/api/purchases/user/:userId', async (req, res) => {
  try {
    const purchases = storage.getItem('purchases');
    const userPurchases = purchases.filter(p => p.userId === req.params.userId);
    res.json(userPurchases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user purchases' });
  }
});

// 保存课程详细内容
app.post('/api/course-content', async (req, res) => {
  try {
    const { courseId, content } = req.body;
    
    if (!courseId || !content) {
      return res.status(400).json({ error: 'Course ID and content are required' });
    }
    
    const courseContents = storage.getItem('courseContent');
    
    // 查找现有内容
    const existingContentIndex = courseContents.findIndex(c => c.courseId === courseId);
    
    if (existingContentIndex !== -1) {
      courseContents[existingContentIndex].content = content;
      courseContents[existingContentIndex].updatedAt = new Date().toISOString();
    } else {
      // 添加新内容
      courseContents.push({
        id: Date.now().toString(),
        courseId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    await storage.setItem('courseContent', courseContents);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save course content' });
  }
});

// 获取课程详细内容
app.get('/api/course-content/:courseId', async (req, res) => {
  try {
    const courseContents = storage.getItem('courseContent');
    const content = courseContents.find(c => c.courseId === req.params.courseId);
    
    if (!content) {
      return res.json({ courseId: req.params.courseId, content: null });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
});

// 清空所有数据（用于测试）
app.delete('/api/storage', async (req, res) => {
  try {
    await storage.clear();
    res.json({ success: true, message: 'All data cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear storage' });
  }
});
app.post('/api/verify-wallet', (req, res) => {
  const { address, message, signature, timestamp } = req.body;
  console.log(address)
  try {
    // 验证时间戳（防止重放攻击）可选
    const now = Date.now();
    console.log(now)
    if (now - timestamp > 5 * 60 * 1000) { // 5分钟有效期 可选
      return res.json({ verified: false, error: '签名已过期' });
    }
    
    // 验证签名 必要
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.error(recoveredAddress.toLowerCase())
    console.error(address.toLowerCase())
    console.log(recoveredAddress.toLowerCase() === address.toLowerCase())
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      // 验证成功，可以生成JWT token或session, 可选
      const token = generateToken({address});
      console.log(token)
      res.json({ 
        verified: true, 
        token,
        address: recoveredAddress 
      });
    } else {
      res.json({ verified: false, error: '签名验证失败' });
    }
  } catch (error) {
    res.json({ verified: false, error: '验证过程出错' });
  }
});

// 启动服务器
async function startServer() {
  await initStorage();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}


startServer();
    