# 慢递Mandy - 基于`Sui` + `Seal` + `Walrus`的时间胶囊信件服务

Mandy是一个建立在Sui区块链上的`dApp`,允许用户创建和发送"时间胶囊"信件,这些信件只能在特定时间点后才能被接收者查看。通过`Seal`进行信件内容的加解密，通过`Walrus`存储信件的附件附件。

## 项目特色

- 🕰️ **时间自定义**: 设置特定时间点后,信件才可被查看
- 💌 **情感传递**: 创建有意义的信息,在未来的特定时刻传递给重要的人
- 💙 **心理慰藉**: 为用户提供一种新的情感表达方式
- 🔐 **隐私安全**: 基于`Sui` + `Seal`,确保信件内容的隐私保护和不可篡改性
- 🌐 **去中心化存储**: 使用`Walrus`去中心化技术保存信件附件

## 快速开始

### 前提条件

- Node.js 20+
- pnpm 8+
- Sui钱包

### 安装

```bash
# 克隆项目
git clone https://github.com/rzexin/mandy.git
cd mandy

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 智能合约

项目包含Move语言编写的智能合约,位于`contract/mandy/`目录。

#### 编译合约

```bash
cd contract/mandy
sui move build
```

#### 部署合约

```bash
sui client publish
```

## 项目结构

```
mandy/
├── contract/            # Sui智能合约
│   └── mandy/           # Mandy合约代码
├── src/                 # 前端源代码
│   ├── app/             # Next.js应用页面
│   ├── components/      # React组件
│   ├── lib/             # 工具库
│   ├── mutations/       # 数据修改方法
│   ├── hooks/           # React hooks
│   ├── types/           # TypeScript类型
│   ├── providers/       # React上下文提供者
│   └── constants/       # 常量定义
└── public/              # 静态资源
```

## 主要功能

1. **创建时间胶囊信件**: 用户可以创建包含文本和附件的信件,并设置特定的未来时间点,信件将会通过`Seal`加密存储与`Sui`链和`Walrus`上
2. **接收和查看信件**: 在设定的时间到达后,接收者才能查看信件内容
3. **多语言支持**: 应用支持多种语言界面
4. **钱包集成**: 与Sui钱包无缝集成

## 贡献指南

欢迎贡献代码、报告问题或提出改进建议。请遵循以下步骤:

1. Fork项目
2. 创建新的分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加了一些很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 联系方式

- 项目维护者: X@jasonruan <rzexin@gmail.com>
- 项目链接: [https://github.com/rzexin/mandy](https://github.com/rzexin/mandy)
