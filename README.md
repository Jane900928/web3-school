# 🎓 Web3 School

一个基于区块链技术的在线教育平台，支持使用加密货币购买课程和学习资源。

## 📋 项目概述

Web3 School 是一个现代化的去中心化教育平台，结合了传统在线教育和区块链技术的优势。用户可以使用 ETH 购买课程，所有交易都通过智能合约进行安全处理。

### ✨ 主要特性

- 🔗 **区块链集成**: 支持 MetaMask 钱包连接
- 💰 **加密货币支付**: 使用 ETH 购买课程
- 📚 **课程管理**: 完整的课程购买和管理系统
- 🎯 **多网络支持**: 支持以太坊主网和测试网
- 📱 **响应式设计**: 适配桌面和移动设备
- 🔔 **实时通知**: 交易状态实时反馈

## 🏗️ 技术架构

### 前端 (web3-app)
- **React 19**: 现代化的用户界面框架
- **Vite**: 快速的构建工具
- **Ethers.js 6**: 以太坊区块链交互
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Lucide React**: 精美的图标库

### 后端 (backend)
- **Node.js + Express**: 服务器框架
- **LowDB**: 轻量级数据库
- **CORS**: 跨域资源共享支持
- **UUID**: 唯一标识符生成

### 区块链
- **智能合约**: 课程购买和管理
- **ABI 配置**: 完整的合约接口
- **多网络支持**: 主网/测试网切换

## 🚀 快速开始

### 前置要求

- Node.js 16+ 
- npm 或 yarn
- MetaMask 浏览器扩展
- 测试网 ETH (用于测试)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/Jane900928/web3-school.git
cd web3-school
```

2. **启动后端服务**
```bash
cd backend
npm install
npm start
```
后端服务将在 `http://localhost:3001` 启动

3. **启动前端应用**
```bash
cd ../web3-app
npm install
npm run dev
```
前端应用将在 `http://localhost:5173` 启动

### 环境配置

1. **MetaMask 设置**
   - 安装 MetaMask 浏览器扩展
   - 创建或导入钱包
   - 添加 Sepolia 测试网络

2. **获取测试 ETH**
   - 访问 [Sepolia 水龙头](https://sepoliafaucet.com/)
   - 获取测试用的 ETH

3. **智能合约配置**
   - 确保合约已部署到对应网络
   - 更新合约地址配置

## 🎮 使用指南

### 连接钱包
1. 点击"连接钱包"按钮
2. 选择 MetaMask
3. 授权连接请求
4. 确认网络为 Sepolia 测试网

### 购买课程
1. 浏览可用课程列表
2. 点击感兴趣的课程
3. 查看课程详情和价格
4. 点击"购买课程"
5. 确认 MetaMask 交易
6. 等待交易确认

### 查看已购课程
1. 连接钱包后自动显示
2. 在"我的课程"部分查看
3. 点击进入学习页面

## 📁 项目结构

```
web3-school/
├── backend/                 # 后端 API 服务
│   ├── server.js           # Express 服务器
│   ├── storage.json        # 数据存储
│   └── package.json        # 后端依赖
├── web3-app/               # React 前端应用
│   ├── src/
│   │   ├── App.jsx         # 主应用组件
│   │   ├── CourseMarketplaceABI.json  # 智能合约 ABI
│   │   ├── pages/          # 页面组件
│   │   └── assets/         # 静态资源
│   ├── public/             # 公共文件
│   └── package.json        # 前端依赖
└── README.md               # 项目文档
```

## 🔧 API 接口

### 课程相关
- `GET /api/courses` - 获取所有课程
- `POST /api/courses` - 创建新课程
- `GET /api/courses/:id` - 获取课程详情
- `PUT /api/courses/:id` - 更新课程信息

### 购买记录
- `GET /api/purchases` - 获取购买记录
- `POST /api/purchases` - 创建购买记录
- `GET /api/purchases/:address` - 获取用户购买记录

## 🧪 开发与测试

### 开发模式
```bash
# 后端开发模式 (带热重载)
cd backend && npm run dev

# 前端开发模式
cd web3-app && npm run dev
```

### 代码检查
```bash
cd web3-app && npm run lint
```

### 构建生产版本
```bash
cd web3-app && npm run build
```

## 🔒 安全注意事项

- ✅ 智能合约已经过测试
- ✅ 前端输入验证完整
- ✅ 交易确认机制
- ⚠️ 仅在测试网络使用
- ⚠️ 不要在主网使用真实资金测试

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者: Jane900928
- GitHub: [@Jane900928](https://github.com/Jane900928)
- 项目链接: [https://github.com/Jane900928/web3-school](https://github.com/Jane900928/web3-school)

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Ethers.js](https://docs.ethers.io/) - 以太坊库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Express](https://expressjs.com/) - Web 框架

---

⭐ 如果这个项目对你有帮助，请给个 Star！