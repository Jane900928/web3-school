"use client";
import './APP.css'
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  Wallet,
  RefreshCw,
  BookOpen,
  ShoppingCart,
  History,
  PlusCircle,
  CheckCircle,
  Loader2,
  X,
  ChevronDown,
  Globe,
  GraduationCap,
  Info,
  Unlock,
  ArrowLeft,
  Lock,


  DollarSign
} from 'lucide-react';

// 课程合约ABI
const COURSE_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_paymentToken", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "courseId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "instructor", "type": "address" }
    ],
    "name": "CourseCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "courseId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "CoursePurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "allCourseIds",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "checkAllowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "courseId", "type": "uint256" }
    ],
    "name": "checkPurchase",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "createCourse",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "courses",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "address", "name": "instructor", "type": "address" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCourseCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "courseId", "type": "uint256" }],
    "name": "getCourseDetails",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "address", "name": "instructor", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "hasPurchased",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextCourseId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paymentToken",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "courseId", "type": "uint256" }],
    "name": "buyCourse",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ERC20代币ABI
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "_owner", "type": "address" },
      { "name": "_spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "remaining", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  }
];

// KLExchange合约ABI
const KL_EXCHANGE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_klToken", "type": "address" },
      { "internalType": "uint256", "name": "_initialRate", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "ethAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "klAmount", "type": "uint256" }
    ],
    "name": "Exchanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "oldRate", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newRate", "type": "uint256" }
    ],
    "name": "ExchangeRateUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "exchange",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exchangeRate",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "klToken",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_newRate", "type": "uint256" }],
    "name": "setExchangeRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawEth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "withdrawKl",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// 支持的网络配置
const NETWORKS = {
  1: { name: "Ethereum Mainnet", symbol: "ETH" },
  5: { name: "Goerli Testnet", symbol: "ETH" },
  11155111: { name: "Sepolia Testnet", symbol: "ETH" },
  137: { name: "Polygon Mainnet", symbol: "MATIC" },
  80001: { name: "Polygon Testnet", symbol: "MATIC" }
};

// 目标网络ID (Sepolia测试网)
const TARGET_CHAIN_ID = 11155111;

// API基础URL
const API_BASE_URL = 'http://localhost:3001/api';

// KLExchange合约地址 - 替换为实际部署的合约地址
const KL_EXCHANGE_ADDRESS = "0x590C119FeE8679585b6DaCBde3642Ad510e49053";

export default function CourseMarketplace() {
  // 钱包状态
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [nativeBalance, setNativeBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // 合约状态
  const [contract, setContract] = useState(null);
  const [paymentToken, setPaymentToken] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState("TOKEN");
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [purchasingCourse, setPurchasingCourse] = useState(null);
  const [approvingToken, setApprovingToken] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [myCreatedCourses, setMyCreatedCourses] = useState([]);
  const [myPurchasedCourses, setMyPurchasedCourses] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyView, setHistoryView] = useState("created");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "区块链基础知识",
    description: "学习区块链技术的核心概念和工作原理",
    price: "10",
    content: "课程详细内容：\n1. 区块链基本概念\n2. 分布式账本技术\n3. 加密算法原理\n4. 智能合约基础\n5. 实际应用场景"
  });
  const [notification, setNotification] = useState({
    message: "",
    type: "info",
    show: false
  });

  // 课程详情状态
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [loadingCourseDetail, setLoadingCourseDetail] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [courseContent, setCourseContent] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  // KL兑换相关状态
  const [klExchangeContract, setKlExchangeContract] = useState(null);
  const [exchangeRate, setExchangeRate] = useState("0");
  const [ethToExchange, setEthToExchange] = useState("0.1");
  const [klToReceive, setKlToReceive] = useState("0");
  const [exchanging, setExchanging] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [contractKlBalance, setContractKlBalance] = useState("0");

  // 连接钱包
  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);

        // 请求账户访问
        const accounts = await newProvider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          const address = accounts[0];
          // 获取签名者
          const newSigner = await newProvider.getSigner();
          setSigner(newSigner);
          // 创建要签名的消息（通常包含时间戳防重放）
          const timestamp = Date.now();
          const message = `验证钱包地址: ${address}\n时间戳: ${timestamp}`;
          try {
            const signature = await newSigner.signMessage(message);

            // 发送到后端验证
            const response = await fetch(`${API_BASE_URL}/verify-wallet`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                address,
                message,
                signature,
                timestamp
              })
            });
            
            const result = await response.json();
            console.log('123',result)
            if (result.verified) {
              // 验证成功，可以进行后续操作
              console.log('钱包验证成功');
            }
          } catch (error) {
            console.error('签名失败:', error);
          }

          // 获取原生代币余额
          const newBalance = await newProvider.getBalance(accounts[0]);
          setNativeBalance(ethers.formatEther(newBalance));

          // 获取网络信息
          const network = await newProvider.getNetwork();
          setNetwork({
            id: network.chainId,
            name: NETWORKS[network.chainId]?.name || "Unknown",
            symbol: NETWORKS[network.chainId]?.symbol || "ETH"
          });

          // 初始化合约实例 - 替换为实际合约地址
          const contractAddress = "0x719b7553bdD6d321B61D77386c89a1c0E9fD6969";
          const newContract = new ethers.Contract(contractAddress, COURSE_ABI, newSigner);
          setContract(newContract);

          // 初始化KLExchange合约
          const klExchange = new ethers.Contract(KL_EXCHANGE_ADDRESS, KL_EXCHANGE_ABI, newSigner);
          setKlExchangeContract(klExchange);

          // 获取支付代币地址并初始化
          try {
            const tokenAddress = await newContract.paymentToken();
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, newSigner);
            setPaymentToken(tokenContract);

            // 获取代币余额
            const tokenBal = await tokenContract.balanceOf(accounts[0]);
            setTokenBalance(ethers.formatEther(tokenBal));

            // 获取代币符号
            try {
              const symbol = await tokenContract.symbol();
              setTokenSymbol(symbol);
            } catch (symbolErr) {
              console.warn("无法获取代币符号，使用默认值:", symbolErr);
              setTokenSymbol("KL");
            }

            // 获取KLExchange合约中的KL余额
            const klBalance = await tokenContract.balanceOf(KL_EXCHANGE_ADDRESS);
            setContractKlBalance(ethers.formatEther(klBalance));
          } catch (tokenErr) {
            console.error("获取支付代币信息失败:", tokenErr);
            showNotification("获取支付代币信息失败", "error");
          }

          // 获取兑换汇率
          try {
            const rate = await klExchange.exchangeRate();
            setExchangeRate(ethers.formatEther(rate));
            calculateKlAmount(ethToExchange, ethers.formatEther(rate));
          } catch (rateErr) {
            console.error("获取兑换汇率失败:", rateErr);
            showNotification("获取兑换汇率失败", "error");
          }

          setIsConnected(true);
          showNotification("钱包连接成功", "success");
        }
      } catch (error) {
        console.error("连接钱包失败:", error);
        showNotification("连接钱包失败，请重试", "error");
      } finally {
        setIsConnecting(false);
      }
    } else {
      showNotification("请安装MetaMask钱包", "error");
    }
  }, [ethToExchange]);

  // 断开钱包连接
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setNativeBalance("0");
    setTokenBalance("0");
    setNetwork(null);
    setContract(null);
    setPaymentToken(null);
    setKlExchangeContract(null);
    setIsConnected(false);
    showNotification("钱包已断开连接", "info");
  };

  // 切换网络
  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // 关键修复：将十进制链ID转换为十六进制字符串
        const chainIdHex = `0x${TARGET_CHAIN_ID.toString(16)}`;

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }], // 使用十六进制链ID
        });
        showNotification(`已切换到 ${NETWORKS[TARGET_CHAIN_ID].name}`, "success");
      } catch (error) {
        console.error("切换网络失败:", error);
        if (error.code === 4902) {
          // 尝试添加Sepolia测试网（同样使用十六进制链ID）
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainIdHex, // 十六进制
                  chainName: "Sepolia Testnet",
                  rpcUrls: ["https://sepolia.infura.io/v3/"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18
                  }
                }
              ]
            });
          } catch (addError) {
            console.error("添加网络失败:", addError);
            showNotification("添加Sepolia网络失败，请手动添加", "error");
          }
        } else {
          showNotification("切换网络失败，请重试", "error");
        }
      }
    }
  };

  // 显示通知
  const showNotification = (message, type) => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // 监听账户和网络变化
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== address) {
          setAddress(accounts[0]);
          if (provider) {
            const newSigner = await provider.getSigner();
            setSigner(newSigner);
            const newBalance = await provider.getBalance(accounts[0]);
            setNativeBalance(ethers.formatEther(newBalance));

            // 更新代币余额
            if (paymentToken) {
              const tokenBal = await paymentToken.balanceOf(accounts[0]);
              setTokenBalance(ethers.formatEther(tokenBal));
            }

            showNotification("账户已切换", "info");
          }
        }
      };

      const handleNetworkChanged = async (chainId) => {
        const newChainId = parseInt(chainId, 16);
        if (provider) {
          const newNetwork = await provider.getNetwork();
          setNetwork({
            id: newNetwork.chainId,
            name: NETWORKS[newNetwork.chainId]?.name || "Unknown",
            symbol: NETWORKS[newNetwork.chainId]?.symbol || "ETH"
          });

          if (newChainId !== TARGET_CHAIN_ID) {
            showNotification(`当前网络不是 ${NETWORKS[TARGET_CHAIN_ID].name}`, "info");
          } else {
            // 刷新汇率和余额
            if (klExchangeContract) {
              try {
                const rate = await klExchangeContract.exchangeRate();
                setExchangeRate(ethers.formatEther(rate));
                calculateKlAmount(ethToExchange, ethers.formatEther(rate));
              } catch (rateErr) {
                console.error("获取兑换汇率失败:", rateErr);
              }
            }

            if (paymentToken) {
              try {
                const klBalance = await paymentToken.balanceOf(KL_EXCHANGE_ADDRESS);
                setContractKlBalance(ethers.formatEther(klBalance));
              } catch (err) {
                console.error("获取合约KL余额失败:", err);
              }
            }
          }
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleNetworkChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleNetworkChanged);
      };
    }
  }, [address, provider, paymentToken, klExchangeContract, ethToExchange]);

  // 刷新余额
  const refreshBalance = async () => {
    if (provider && address) {
      try {
        // 刷新原生代币余额
        const newBalance = await provider.getBalance(address);
        setNativeBalance(ethers.formatEther(newBalance));

        // 刷新支付代币余额
        if (paymentToken) {
          const tokenBal = await paymentToken.balanceOf(address);
          setTokenBalance(ethers.formatEther(tokenBal));

          // 刷新合约中的KL余额
          const klBalance = await paymentToken.balanceOf(KL_EXCHANGE_ADDRESS);
          setContractKlBalance(ethers.formatEther(klBalance));
        }

        // 刷新兑换汇率
        if (klExchangeContract) {
          const rate = await klExchangeContract.exchangeRate();
          setExchangeRate(ethers.formatEther(rate));
          calculateKlAmount(ethToExchange, ethers.formatEther(rate));
        }
      } catch (error) {
        console.error("刷新余额失败:", error);
        showNotification("刷新余额失败", "error");
      }
    }
  };

  // 计算可获得的KL代币数量
  const calculateKlAmount = (ethAmount, rate) => {
    if (!ethAmount || !rate) return;
    const kl = parseFloat(ethAmount) * parseFloat(rate);
    setKlToReceive(kl.toFixed(6));
  };

  // 处理ETH输入变化
  const handleEthInputChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setEthToExchange(value);
      calculateKlAmount(value, exchangeRate);
    }
  };

  // 执行KL代币兑换
  const handleExchange = async () => {
    if (!klExchangeContract || !signer || !address) return;

    const ethAmount = parseFloat(ethToExchange);
    if (ethAmount <= 0) {
      showNotification("请输入有效的ETH数量", "error");
      return;
    }

    // 检查合约是否有足够的KL代币
    if (parseFloat(klToReceive) > parseFloat(contractKlBalance)) {
      showNotification("合约中KL代币不足，无法兑换", "error");
      return;
    }

    try {
      setExchanging(true);
      const ethAmountWei = ethers.parseEther(ethToExchange.toString());

      // 调用兑换函数
      const tx = await klExchangeContract.exchange({
        value: ethAmountWei
      });

      showNotification(`正在兑换 ${ethToExchange} ETH 为 KL 代币，请等待确认...`, "info");

      // 等待交易确认
      const receipt = await tx.wait();
      console.log('receipt', receipt.logs)
      // 查找兑换事件
      const exchangeEvent = receipt.logs.find(log =>
        log.topics[0] === ethers.id("Exchanged(address,uint256,uint256)")
      );
      console.log('exchangeEvent', exchangeEvent.data)
      if (exchangeEvent) {
        // 修复1：使用更安全的地址转换方式，允许宽松验证
        const userHex = exchangeEvent.topics[1];
        console.log('userHex raw:', userHex);
        const user = ethers.getAddress('0x' + userHex.slice(-40));
        console.log('user', user)
        // 修复2：确保解码参数与合约定义完全一致
        const [ethAmt, klAmt] = ethers.AbiCoder.defaultAbiCoder().decode(
          ["uint256", "uint256"],
          exchangeEvent.data
        );

        // 修复3：验证用户地址是否与当前用户匹配（增加安全性）
        if (user.toLowerCase() !== address.toLowerCase()) {
          console.warn("事件中的用户地址与当前用户不匹配");
        }

        showNotification(
          `成功兑换 ${ethers.formatEther(ethAmt)} ETH 为 ${ethers.formatEther(klAmt)} ${tokenSymbol}`,
          "success"
        );
      } else {
        showNotification(`兑换成功！`, "success");
      }

      // 刷新余额和汇率
      refreshBalance();

      // 关闭弹窗
      setShowExchangeModal(false);
      setEthToExchange("0.1");
    } catch (error) {
      console.error("兑换失败:", error);
      let errorMsg = "兑换失败";
      if (error.data) {
        try {
          const decoded = klExchangeContract.interface.parseError(error.data);
          errorMsg += ": " + decoded.args[0];
        } catch (e) {
          errorMsg += ": 交易被拒绝";
        }
      }
      showNotification(errorMsg, "error");
    } finally {
      setExchanging(false);
    }
  };

  // 检查用户是否购买了课程（通过API）
  const checkUserPurchase = async (userId, courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/purchases/check?userId=${userId}&courseId=${courseId}`);

      if (!response.ok) {
        throw new Error('Failed to check purchase status');
      }

      const data = await response.json();
      return data.purchased;
    } catch (error) {
      console.error('Error checking purchase status:', error);
      // 如果API检查失败，尝试通过合约检查
      if (contract && userId && courseId) {
        try {
          return await contract.checkPurchase(userId, courseId);
        } catch (contractErr) {
          console.error('Error checking purchase status from contract:', contractErr);
        }
      }
      return false;
    }
  };

  // 记录购买信息到API
  const recordPurchaseToAPI = async (userId, courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, courseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to record purchase');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording purchase:', error);
      return null;
    }
  };

  // 从API获取课程详情
  const fetchCourseDetailFromAPI = async (courseId) => {
    try {
      setLoadingCourseDetail(true);
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching course detail:', error);
      return null;
    } finally {
      setLoadingCourseDetail(false);
    }
  };

  // 从API获取课程内容
  const fetchCourseContentFromAPI = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/course-content/${courseId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch course content');
      }

      const data = await response.json();
      setCourseContent(data.content || "");
      return data.content;
    } catch (error) {
      console.error('Error fetching course content:', error);
      setCourseContent("");
      return null;
    }
  };

  // 保存课程信息到API
  const saveCourseToAPI = async (course) => {
    try {
      // 转换所有BigInt类型为字符串
      const serializedCourse = JSON.parse(JSON.stringify(course, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializedCourse),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving course:', error);
      showNotification('保存课程信息失败', 'error');
      return null;
    }
  };

  // 保存课程内容到API
  const saveCourseContentToAPI = async (courseId, content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/course-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save course content');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving course content:', error);
      return null;
    }
  };

  // 获取所有课程
  const fetchAllCourses = async () => {
    if (contract) {
      try {
        const courseCount = await contract.getCourseCount();
        const courses = [];

        for (let i = 1; i <= courseCount; i++) {
          try {
            // 检查课程是否存在
            const course = await contract.courses(i);
            if (!course.exists) continue;

            // 获取详细信息
            const { id, title, description, price, instructor } = await contract.getCourseDetails(i);

            // 检查当前用户是否已购买
            const isPurchased = address ? await contract.checkPurchase(address, id) : false;

            // 检查授权是否足够
            let hasEnoughAllowance = false;
            if (address && paymentToken && contract) {
              const currentAllowance = await paymentToken.allowance(address, contract.target);
              hasEnoughAllowance = currentAllowance >= price;
            }

            const courseData = {
              id: id.toString(),
              creator: instructor,
              title,
              description,
              price: ethers.formatEther(price),
              priceWei: price.toString(), // 将BigInt转换为字符串
              isPurchased,
              hasEnoughAllowance,
              isCreator: instructor.toLowerCase() === address?.toLowerCase()
            };

            courses.push(courseData);

            // 检查API中是否已有该课程，没有则保存
            const response = await fetch(`${API_BASE_URL}/courses/${courseData.id}`);
            if (!response.ok) {
              await saveCourseToAPI(courseData);
            }
          } catch (courseErr) {
            console.warn(`获取课程 ${i} 失败:`, courseErr);
          }
        }

        setAllCourses(courses);
        return courses;
      } catch (error) {
        console.error("获取所有课程失败:", error);
        showNotification("获取课程列表失败", "error");
        return [];
      }
    }
    return [];
  };

  // 获取我创建的课程
  const fetchMyCreatedCourses = async () => {
    if (contract && address) {
      try {
        const allCourses = await fetchAllCourses();
        // 筛选出当前用户创建的课程
        const myCourses = allCourses.filter(
          course => course.isCreator
        );

        setMyCreatedCourses(myCourses);
      } catch (error) {
        console.error("获取我创建的课程失败:", error);
        showNotification("获取您创建的课程失败", "error");
      }
    }
  };

  // 获取我购买的课程
  const fetchMyPurchasedCourses = async () => {
    if (contract && address) {
      try {
        const allCourses = await fetchAllCourses();
        // 筛选出当前用户已购买的课程
        const purchasedCourses = allCourses.filter(
          course => course.isPurchased
        );

        setMyPurchasedCourses(purchasedCourses);
      } catch (error) {
        console.error("获取我购买的课程失败:", error);
        showNotification("获取您购买的课程失败", "error");
      }
    }
  };

  // 当合约准备好时获取课程数据
  useEffect(() => {
    if (contract && isConnected) {
      fetchAllCourses();
      fetchMyCreatedCourses();
      fetchMyPurchasedCourses();

      // 定时刷新课程列表
      const interval = setInterval(() => {
        fetchAllCourses();
        fetchMyCreatedCourses();
        fetchMyPurchasedCourses();
      }, 30000); // 每30秒刷新一次

      return () => clearInterval(interval);
    }
  }, [contract, isConnected]);

  // 创建课程
  const handleCreateCourse = async () => {
    if (!contract || !signer || !address) return;

    const { title, description, price, content } = createForm;

    if (!title.trim() || !description.trim() || parseFloat(price) <= 0 || !content.trim()) {
      showNotification("请填写所有字段并确保价格大于0", "error");
      return;
    }

    try {
      setCreatingCourse(true);
      // 将价格转换为wei单位
      const priceWei = ethers.parseEther(price);

      const tx = await contract.createCourse(
        title,
        description,
        priceWei
      );

      showNotification("正在创建课程，请等待确认...", "info");

      // 等待交易确认
      const receipt = await tx.wait();

      // 查找CourseCreated事件以获取课程ID
      const courseCreatedEvent = receipt.logs.find(log =>
        log.topics[0] === ethers.id("CourseCreated(uint256,string,uint256,address)")
      );

      if (courseCreatedEvent) {
        // 使用ethers v6的方式解码课程ID
        const courseId = ethers.AbiCoder.defaultAbiCoder().decode(
          ["uint256"],
          courseCreatedEvent.topics[1]
        )[0].toString();

        // 创建课程数据对象
        const newCourse = {
          id: courseId,
          creator: address,
          title,
          description,
          price,
          priceWei: priceWei.toString(), // 将BigInt转换为字符串
          isPurchased: false,
          hasEnoughAllowance: false,
          isCreator: true
        };

        // 保存到API
        await saveCourseToAPI(newCourse);

        // 保存课程内容
        await saveCourseContentToAPI(courseId, content);
      }

      showNotification("课程创建成功！", "success");
      setShowCreateForm(false);
      setCreateForm({
        title: "区块链基础知识",
        description: "学习区块链技术的核心概念和工作原理",
        price: "10",
        content: "课程详细内容：\n1. 区块链基本概念\n2. 分布式账本技术\n3. 加密算法原理\n4. 智能合约基础\n5. 实际应用场景"
      });

      // 刷新课程列表
      fetchAllCourses();
      fetchMyCreatedCourses();
    } catch (error) {
      console.error("创建课程失败:", error);
      let errorMsg = "创建课程失败";
      if (error.data) {
        try {
          const decoded = contract.interface.parseError(error.data);
          errorMsg += ": " + decoded.args[0];
        } catch (e) {
          errorMsg += ": 合约执行被终止";
        }
      }
      showNotification(errorMsg, "error");
    } finally {
      setCreatingCourse(false);
    }
  };

  // 单独授权代币
  const approveTokenOnly = async (courseId, price) => {
    if (!paymentToken || !address || !contract) return;

    try {
      setApprovingToken(courseId);
      const priceWei = ethers.parseEther(price);

      // 授权足够的代币
      const tx = await paymentToken.approve(contract.target, priceWei);
      showNotification(`正在授权 ${price} ${tokenSymbol}，请等待确认...`, "info");

      // 等待授权交易确认
      await tx.wait();

      showNotification(`成功授权 ${price} ${tokenSymbol}`, "success");

      // 刷新课程列表以更新授权状态
      fetchAllCourses();

      setApprovingToken(null);
    } catch (error) {
      console.error("代币授权失败:", error);
      showNotification("代币授权失败，请重试", "error");
      setApprovingToken(null);
    }
  };

  // 购买课程
  const handlePurchaseCourse = async (courseId, price) => {
    if (!contract || !address || !paymentToken) return;

    try {
      setPurchasingCourse(courseId);
      const priceWei = ethers.parseEther(price);

      // 再次检查授权
      const currentAllowance = await paymentToken.allowance(address, contract.target);
      if (currentAllowance < priceWei) {
        showNotification("代币授权不足，请先授权", "error");
        setPurchasingCourse(null);
        return;
      }

      // 检查余额
      const balance = await paymentToken.balanceOf(address);
      if (balance < priceWei) {
        showNotification(`您的${tokenSymbol}余额不足，是否需要兑换？`, "error");
        setPurchasingCourse(null);
        return;
      }

      // 调用购买课程方法
      const tx = await contract.buyCourse(courseId);
      showNotification("正在购买课程，请等待确认...", "info");

      // 等待交易确认
      await tx.wait();

      // 记录购买信息到API
      await recordPurchaseToAPI(address, courseId.toString());

      showNotification("课程购买成功！", "success");

      // 刷新数据
      refreshBalance();
      fetchAllCourses();
      fetchMyPurchasedCourses();

      // 如果在详情页中购买，刷新详情
      if (showCourseDetail && selectedCourse && selectedCourse.id === courseId.toString()) {
        handleViewCourseDetail(selectedCourse);
      }
    } catch (error) {
      console.error("购买课程失败:", error);
      let errorMsg = "购买课程失败";
      if (error.data) {
        try {
          const decoded = contract.interface.parseError(error.data);
          errorMsg += ": " + decoded.args[0];
        } catch (e) {
          errorMsg += ": 合约执行被终止";
        }
      }
      showNotification(errorMsg, "error");
    } finally {
      setPurchasingCourse(null);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };

  // 格式化地址显示
  const formatAddress = (addr) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  };

  // 查看课程详情 - 先检查购买状态
  const handleViewCourseDetail = async (course) => {
    if (!isConnected) {
      showNotification("请先连接钱包", "info");
      return;
    }

    setCheckingPurchase(true);
    setSelectedCourse(course);

    try {
      // 检查用户是否购买了该课程
      const isPurchased = await checkUserPurchase(address, course.id);
      // 检查是否是课程创建者
      const creator = course.creator.toLowerCase() === address.toLowerCase();

      setIsCreator(creator);

      // 如果已购买或是创建者，获取完整详情
      if (isPurchased || creator) {
        const detailedCourse = await fetchCourseDetailFromAPI(course.id);
        if (detailedCourse) {
          setSelectedCourse({ ...course, ...detailedCourse, isPurchased });
        } else {
          setSelectedCourse({ ...course, isPurchased });
        }

        // 获取课程内容
        await fetchCourseContentFromAPI(course.id);

        setShowCourseDetail(true);
      } else {
        // 未购买且不是创建者，仍然显示详情但不显示内容
        setSelectedCourse({ ...course, isPurchased });
        setCourseContent("");
        setShowCourseDetail(true);
      }
    } catch (error) {
      console.error("Error viewing course details:", error);
      showNotification("查看课程详情失败", "error");
    } finally {
      setCheckingPurchase(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white m-0 p-0">
      {/* 通知组件 */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${notification.type === "success" ? "bg-green-500/90" :
          notification.type === "error" ? "bg-red-500/90" : "bg-blue-500/90"
          }`}>
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : notification.type === "error" ? (
            <X className="h-5 w-5" />
          ) : (
            <Info className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <header className="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              web3 school
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="bg-white/10 rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-1.5">
                  <span>{parseFloat(tokenBalance).toFixed(4)} {tokenSymbol}</span>
                  <button
                    onClick={refreshBalance}
                    className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* 兑换按钮 */}
                <button
                  onClick={() => setShowExchangeModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 transition-colors"
                >
                  {/* <SwapHorizontal className="h-3.5 w-3.5" /> */}
                  <span>兑换 {tokenSymbol}</span>
                </button>

                {network?.id !== TARGET_CHAIN_ID && (
                  <button
                    onClick={switchNetwork}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>{network?.name}</span>
                  </button>
                )}

                <div className="relative group">
                  <button className="bg-white/10 hover:bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors">
                    <span>{formatAddress(address || "")}</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button
                      onClick={disconnectWallet}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      <Wallet className="h-4 w-4" />
                      <span>断开连接</span>
                    </button>
                    <button
                      onClick={() => setShowHistory(true)}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      <History className="h-4 w-4" />
                      <span>我的课程</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>连接中...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    <span>连接钱包</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* KL代币兑换弹窗 */}
      {showExchangeModal && isConnected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full overflow-hidden flex flex-col border border-white/10 transform transition-all duration-300 scale-100">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {/* <SwapHorizontal className="h-5 w-5 text-purple-400" /> */}
                  <span>兑换 {tokenSymbol} 代币</span>
                </h3>
                <button
                  onClick={() => setShowExchangeModal(false)}
                  disabled={exchanging}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">当前汇率</label>
                  <button
                    onClick={refreshBalance}
                    className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
                  >
                    刷新
                  </button>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-center text-lg font-medium">
                    1 ETH = <span className="text-purple-400">{parseFloat(exchangeRate).toFixed(4)}</span> {tokenSymbol}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  输入ETH数量
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={ethToExchange}
                    onChange={handleEthInputChange}
                    min="0.001"
                    step="0.001"
                    disabled={exchanging}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    {/* <Coin className="h-4 w-4 text-gray-400" /> */}
                    <span className="text-gray-400">ETH</span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <div className="flex gap-2">
                    {[0.01, 0.1, 0.5, 1].map(amount => (
                      <button
                        key={amount}
                        onClick={() => {
                          setEthToExchange(amount.toString());
                          calculateKlAmount(amount.toString(), exchangeRate);
                        }}
                        disabled={exchanging}
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    您有 {parseFloat(nativeBalance).toFixed(4)} ETH
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center border border-white/20 z-10">
                  {/* <SwapHorizontal className="h-3 w-3 text-gray-400" /> */}
                </div>
                <div className="border-t border-dashed border-white/20 my-2"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  可获得 {tokenSymbol} 数量
                </label>
                <div className="relative bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-lg font-medium text-white">
                    {klToReceive}
                  </p>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {tokenSymbol}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  合约中可兑换的 {tokenSymbol}: {parseFloat(contractKlBalance).toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleExchange}
                disabled={exchanging || parseFloat(ethToExchange) <= 0 || parseFloat(klToReceive) <= 0}
                className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${exchanging || parseFloat(ethToExchange) <= 0 || parseFloat(klToReceive) <= 0
                  ? "opacity-70 cursor-not-allowed"
                  : ""
                  }`}
              >
                {exchanging ? (
                  <>
                    <Loader2 className="h-5 h-5 animate-spin" />
                    <span>兑换中...</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="h-5 h-5" />
                    <span>确认兑换</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* 如果显示课程详情，则展示详情页面 */}
        {showCourseDetail ? (
          <section>
            <button
              onClick={() => setShowCourseDetail(false)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回课程列表</span>
            </button>

            {checkingPurchase ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
              </div>
            ) : selectedCourse ? (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">讲师: {formatAddress(selectedCourse.creator)}</p>
                  <h2 className="text-3xl font-bold">{selectedCourse.title}</h2>
                  <div className="mt-4 inline-block bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium">
                    {selectedCourse.price} {tokenSymbol}
                  </div>

                  {selectedCourse.isPurchased && (
                    <div className="mt-4 inline-block bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-medium ml-2">
                      已购买
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3">课程简介</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedCourse.description}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3">课程内容</h3>
                  {selectedCourse.isPurchased || isCreator ? (
                    courseContent ? (
                      <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-gray-200 leading-relaxed whitespace-pre-line">
                        {courseContent}
                      </div>
                    ) : (
                      <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-gray-400">
                        课程内容尚未添加
                      </div>
                    )
                  ) : (
                    <div className="bg-white/5 p-8 rounded-xl border border-white/10 text-center">
                      <Lock className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">购买课程后即可查看完整内容</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  {/* 只有未购买且不是创建者才能看到授权和购买按钮 */}
                  {!selectedCourse.isPurchased && !isCreator && (
                    <>
                      {/* 独立的授权按钮 */}
                      <button
                        onClick={() => {
                          approveTokenOnly(parseInt(selectedCourse.id), selectedCourse.price)
                            .then(() => fetchCourseDetailFromAPI(selectedCourse.id))
                            .then(detail => detail && setSelectedCourse({ ...selectedCourse, ...detail }));
                        }}
                        disabled={approvingToken === parseInt(selectedCourse.id) || purchasingCourse === parseInt(selectedCourse.id)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${approvingToken === parseInt(selectedCourse.id)
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : selectedCourse.hasEnoughAllowance
                            ? "bg-purple-600/70 hover:bg-purple-600 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                          }`}
                      >
                        {approvingToken === parseInt(selectedCourse.id) ? (
                          <Loader2 className="h-5 h-5 animate-spin" />
                        ) : (
                          <Unlock className="h-5 h-5" />
                        )}
                        <span>授权</span>
                      </button>

                      {/* 购买按钮 */}
                      <button
                        onClick={() => {
                          handlePurchaseCourse(parseInt(selectedCourse.id), selectedCourse.price);
                        }}
                        disabled={
                          approvingToken === parseInt(selectedCourse.id) ||
                          purchasingCourse === parseInt(selectedCourse.id) ||
                          !selectedCourse.hasEnoughAllowance
                        }
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${(approvingToken === parseInt(selectedCourse.id) || purchasingCourse === parseInt(selectedCourse.id)) ||
                          !selectedCourse.hasEnoughAllowance
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                          }`}
                      >
                        {purchasingCourse === parseInt(selectedCourse.id) ? (
                          <Loader2 className="h-5 h-5 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-5 h-5" />
                        )}

                        <span>购买课程</span>
                        {!selectedCourse.hasEnoughAllowance && (
                          <span className="ml-1">需先授权</span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <Info className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">无法加载课程详情</p>
                <button
                  onClick={() => setShowCourseDetail(false)}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  返回课程列表
                </button>
              </div>
            )}
          </section>
        ) : (
          // 课程列表页面
          <>
            <section className="mb-12 text-center">
              <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                区块链教育市场
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                在区块链上创建、购买和销售教育内容。安全、透明、去中心化的学习体验。
              </p>
            </section>

            {isConnected ? (
              <>
                {/* 操作按钮 */}
                <div className="flex justify-center mb-10 gap-4">
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>创建课程</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowHistory(true);
                      fetchMyCreatedCourses();
                      fetchMyPurchasedCourses();
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 flex items-center gap-2"
                  >
                    <History className="h-5 w-5" />
                    <span>我的课程</span>
                  </button>
                </div>

                {/* 创建课程表单 */}
                {showCreateForm && (
                  <div className="max-w-2xl mx-auto mb-12 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl transform transition-all duration-300 hover:shadow-blue-500/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">创建新课程</h3>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">课程标题</label>
                        <input
                          type="text"
                          name="title"
                          value={createForm.title}
                          onChange={handleInputChange}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">课程简介</label>
                        <textarea
                          name="description"
                          value={createForm.description}
                          onChange={handleInputChange}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white h-24 resize-none"
                          placeholder="简要描述课程内容和学习收获"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          价格 ({tokenSymbol})
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={createForm.price}
                          onChange={handleInputChange}
                          min="0.001"
                          step="0.001"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">课程详细内容</label>
                        <textarea
                          name="content"
                          value={createForm.content}
                          onChange={handleInputChange}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white h-32 resize-none"
                          placeholder="输入课程的详细内容，学员购买后可见"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleCreateCourse}
                        disabled={creatingCourse}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {creatingCourse ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>创建中...</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-5 w-5" />
                            <span>发布课程</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 课程列表 */}
                <section>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                    <span>可用课程</span>
                  </h3>

                  {allCourses.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                      <BookOpen className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400 text-lg">暂无可用课程</p>
                      <p className="text-gray-500 mt-2">成为第一个创建课程的人吧！</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allCourses.map((course) => (
                        // 将课程卡片改为可点击
                        <div
                          key={course.id}
                          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer"
                          onClick={() => handleViewCourseDetail(course)}
                        >
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm">讲师: {formatAddress(course.creator)}</p>
                            <h4 className="text-xl font-bold mt-1 mb-2">{course.title}</h4>
                            <p className="text-gray-300 text-sm line-clamp-3">{course.description}</p>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <p className="text-2xl font-bold text-white">{course.price} {tokenSymbol}</p>
                            </div>

                            <div className="flex gap-2">
                              {/* 独立的授权按钮 - 阻止事件冒泡 */}
                              {!course.isPurchased && !course.isCreator && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // 防止触发卡片点击事件
                                    approveTokenOnly(parseInt(course.id), course.price);
                                  }}
                                  disabled={approvingToken === parseInt(course.id) || purchasingCourse === parseInt(course.id)}
                                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5 ${approvingToken === parseInt(course.id)
                                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                    : course.hasEnoughAllowance
                                      ? "bg-purple-600/70 hover:bg-purple-600 text-white"
                                      : "bg-purple-600 hover:bg-purple-700 text-white"
                                    }`}
                                >
                                  {approvingToken === parseInt(course.id) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Unlock className="h-4 w-4" />
                                  )}
                                  <span>授权</span>
                                </button>
                              )}

                              {/* 购买按钮 - 阻止事件冒泡 */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // 防止触发卡片点击事件
                                  handlePurchaseCourse(parseInt(course.id), course.price);
                                }}
                                disabled={
                                  approvingToken === parseInt(course.id) ||
                                  purchasingCourse === parseInt(course.id) ||
                                  course.isPurchased ||
                                  course.isCreator ||
                                  !course.hasEnoughAllowance
                                }
                                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5 ${(approvingToken === parseInt(course.id) || purchasingCourse === parseInt(course.id)) ||
                                  !course.hasEnoughAllowance
                                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                  : course.isPurchased
                                    ? "bg-green-500/20 text-green-300 cursor-not-allowed"
                                    : course.isCreator
                                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                      : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                                  }`}
                              >
                                {purchasingCourse === parseInt(course.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : course.isPurchased ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <ShoppingCart className="h-4 w-4" />
                                )}

                                {course.isPurchased ? <span>已购买</span> : <span>购买</span>}
                                {!course.hasEnoughAllowance && !course.isPurchased && !course.isCreator && (
                                  <span className="text-xs ml-1">需先授权</span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            ) : (
              // 未连接钱包状态
              <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-10 border border-white/10 max-w-md w-full text-center mb-8">
                  <Wallet className="h-16 w-16 mx-auto text-blue-400 mb-6" />
                  <h3 className="text-2xl font-bold mb-3">连接钱包开始使用</h3>
                  <p className="text-gray-300 mb-6">
                    连接您的MetaMask钱包，开始在区块链上创建和购买课程
                  </p>
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-5 h-5 animate-spin" />
                        <span>连接中...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="h-5 h-5" />
                        <span>连接MetaMask</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-6 max-w-2xl">
                  <div className="flex-1 text-center">
                    <div className="bg-white/5 p-4 rounded-full inline-block mb-3">
                      <PlusCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <h4 className="font-bold mb-2">创建课程</h4>
                    <p className="text-gray-400 text-sm">分享您的知识，创建区块链验证的课程</p>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="bg-white/5 p-4 rounded-full inline-block mb-3">
                      <ShoppingCart className="h-8 w-8 text-blue-400" />
                    </div>
                    <h4 className="font-bold mb-2">购买课程</h4>
                    <p className="text-gray-400 text-sm">直接从创作者那里购买教育内容</p>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="bg-white/5 p-4 rounded-full inline-block mb-3">
                      <BookOpen className="h-8 w-8 text-purple-400" />
                    </div>
                    <h4 className="font-bold mb-2">随时随地学习</h4>
                    <p className="text-gray-400 text-sm">访问您购买的课程，不受时间和地点限制</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 我的课程历史弹窗 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-white/10">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <History className="h-5 h-5 text-blue-400" />
                  <span>我的课程</span>
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-5 h-5" />
                </button>
              </div>

              <div className="flex border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setHistoryView("created")}
                  className={`flex-1 py-2 text-center font-medium transition-colors ${historyView === "created"
                    ? "bg-blue-500/20 text-blue-300 border-b-2 border-blue-500"
                    : "bg-transparent text-gray-400 hover:bg-white/5"
                    }`}
                >
                  我创建的课程
                </button>
                <button
                  onClick={() => setHistoryView("purchased")}
                  className={`flex-1 py-2 text-center font-medium transition-colors ${historyView === "purchased"
                    ? "bg-blue-500/20 text-blue-300 border-b-2 border-blue-500"
                    : "bg-transparent text-gray-400 hover:bg-white/5"
                    }`}
                >
                  我购买的课程
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {historyView === "created" ? (
                myCreatedCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400">您尚未创建任何课程</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myCreatedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer"
                        onClick={() => handleViewCourseDetail(course)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-bold text-lg">{course.title}</h4>
                            <p className="text-gray-400 text-sm mt-1">{course.description.substring(0, 100)}...</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{course.price} {tokenSymbol}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                myPurchasedCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400">您尚未购买任何课程</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myPurchasedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer"
                        onClick={() => handleViewCourseDetail(course)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-bold text-lg">{course.title}</h4>
                            <p className="text-gray-400 text-sm">讲师: {formatAddress(course.creator)}</p>
                            <p className="text-gray-400 text-xs mt-1">{course.description.substring(0, 100)}...</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{course.price} {tokenSymbol}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="mt-auto bg-white/5 backdrop-blur-lg border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-white">web3 school</span>
          </div>
          <p>区块链教育市场 © {new Date().getFullYear()}</p>
          <p className="mt-1">安全 · 透明 · 去中心化</p>
        </div>
      </footer>
    </div>
  );
}
