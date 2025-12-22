
# 🧪 深度拆解实验室 (Deep Dissect Lab)

> **"不要被所谓的直觉欺骗。用 AI 的绝对理性，重构你的现实模型。"**

**深度拆解实验室** 是一个基于大语言模型（LLM）的认知分析工具集。与市面上大多数提供“情感慰藉”的 AI 应用不同，本项目致力于提供**反直觉、高信噪比、甚至略带冒犯性**的理性拆解服务。

它利用 DeepSeek（擅长深度推理）和 Google Gemini（擅长长文本与多模态）的能力，通过精心设计的 Prompt Engineering，将抽象的心理困境转化为可视化的结构数据。

---

## ⚡️ 核心特性 (Features)

本项目包含 15 个独立的认知工具模块，分为以下几类：

### 🧠 认知审计 (Cognitive Audit)
- **☣️ 认知生化扫描 (Bias Detector)**: 像检测病毒一样扫描文本中的逻辑谬误与认知偏差。
- **👁️ 真相审讯室 (Subtext Analyzer)**: 拆解话语背后的真实意图（潜台词）和权力关系。
- **⚗️ 语义光谱仪 (Language Smell)**: 分析文本的化学成分、阶层气味、含AI率及毒性。

### ☠️ 风险与模拟 (Risk & Simulation)
- **☠️ 项目验尸官 (Project Coroner)**: 采用“事前验尸(Pre-mortem)”法，假设项目已彻底失败，倒推死因。
- **🌌 平行宇宙观测站 (World Sim)**: 推演异变点（如“如果没有发明互联网”）引发的蝴蝶效应。
- **🦋 混沌计算器 (Extreme Sim)**: 模拟微小坏习惯（如“今天没去健身”）如何导致人生崩盘。

### ⚖️ 决策辅助 (Decision Making)
- **📊 决策推演矩阵 (Decision Matrix)**: 理性拆解复杂决策，权衡短期收益、长期天花板与不可逆风险。
- **🧾 因果发票 (Karmic Invoice)**: 计算选择背后的隐性代价（灵魂、尊严、时间）并开具发票。
- **🏛️ 原型议会 (Personality Jury)**: 脑内不同欲望人格（贪婪、恐惧、道德等）对议题进行投票辩论。
- **🏗️ 精神结构风洞 (Ego Boundary)**: 对人格进行高压测试，寻找崩溃点。

### ⚔️ 思维博弈 (Mind Games)
- **⚔️ 认知角斗场 (Cyber Debate)**: 红蓝 AI 针对议题进行极限逻辑互搏。
- **⛓️ 逻辑异端裁判所 (Devil's Advocate)**: 对你的观点进行残酷的逻辑刑讯逼供。
- **💊 红丸终端 (Red Pill Terminal)**: 撕碎自我欺骗的“蓝丸”幻象，直面残酷真相。

### ⚱️ 创意与考古 (Creativity & Artifacts)
- **🦄 独角兽孵化器 (Concept Stitcher)**: 强行缝合无关概念，生成荒诞但自洽的商业计划书。
- **🏺 数字遗迹博物馆 (Code Archaeologist)**: 像考古一样分析陈旧代码的历史层次与开发者精神状态。

---

## 🛠️ 技术栈 (Tech Stack)

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI Models**: 
  - **DeepSeek V3/R1** (Via OpenAI-compatible API): 用于处理复杂的逻辑推理、批判性思维任务。
  - **Google Gemini 2.5 Flash**: 用于快速生成、结构化数据提取及 Fallback 支持。
- **Styling**: Cyberpunk / Terminal Aesthetic (JetBrains Mono & Space Grotesk fonts).
- **Architecture**: 纯前端架构，无需后端。API Key 存储在本地 LocalStorage。

---

## 🚀 快速开始 (Getting Started)

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
虽然项目支持在 UI 中设置 API Key，但建议在开发时配置 `.env`：

```env
# Google Gemini API Key (Required for basic function)
API_KEY=your_gemini_api_key_here
```

*(DeepSeek API Key 需在应用运行后的“设置”面板中手动输入，存储于 LocalStorage)*

### 3. 启动开发服务器
```bash
npm start
```
访问 `http://localhost:1234` (或根据你的 bundler 提示的端口)。

---

## 🔑 API 策略

项目采用双模型策略：

1.  **优先 DeepSeek**: 对于逻辑性强、需要“讲真话”的模块（如异端裁判所、验尸官），优先尝试调用 DeepSeek API。
2.  **Gemini 兜底**: 如果用户未配置 DeepSeek Key 或请求失败，自动降级使用 Google Gemini Flash 模型。
3.  **JSON 结构化**: 所有的 Prompt 均被设计为强制输出 JSON 格式，通过 TypeScript 接口进行严格的类型校验和 UI 渲染。

---

## 🎨 设计理念

*   **Low Involution (低内卷)**: 不做复杂的用户系统，不做社交分享，用完即走。
*   **Web Native**: 极致的加载速度，响应式布局，PWA 级别的体验。
*   **Aesthetic**: "Void" 风格——黑底、高对比度、故障艺术 (Glitch Art)、单等宽字体。

---

## 📄 License

MIT License. 
Designed for educational and experimental purposes.
