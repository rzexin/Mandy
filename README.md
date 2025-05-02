# Mandy - Time Capsule Letter Service Based on `Sui` + `Seal` + `Walrus`

[中文文档](./README_CN.md)

Mandy is a `dApp` built on the Sui blockchain that allows users to create and send "time capsule" letters, which can only be viewed by recipients after a specific point in time. Letter content is encrypted and decrypted using `Seal`, and letter attachments are stored using `Walrus`.

## Project Features

- 🕰️ **Customizable Timing**: Set specific time points after which letters can be viewed
- 💌 **Emotional Delivery**: Create meaningful messages to be delivered to important people at specific moments in the future
- 💙 **Psychological Comfort**: Provides users with a new way of emotional expression
- 🔐 **Privacy and Security**: Based on `Sui` + `Seal`, ensuring privacy protection and immutability of letter content
- 🌐 **Decentralized Storage**: Using `Walrus` decentralized technology to store letter attachments

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Sui wallet

### Installation

```bash
# Clone the project
git clone https://github.com/rzexin/mandy.git
cd mandy

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Build for production
pnpm build

# Start the production server
pnpm start
```

### Smart Contracts

The project includes smart contracts written in Move language, located in the `contract/mandy/` directory.

#### Compile the Contract

```bash
cd contract/mandy
sui move build
```

#### Deploy the Contract

```bash
sui client publish
```

## Project Structure

```
mandy/
├── contract/            # Sui smart contracts
│   └── mandy/           # Mandy contract code
├── src/                 # Frontend source code
│   ├── app/             # Next.js application pages
│   ├── components/      # React components
│   ├── lib/             # Utility libraries
│   ├── mutations/       # Data modification methods
│   ├── hooks/           # React hooks
│   ├── types/           # TypeScript types
│   ├── providers/       # React context providers
│   └── constants/       # Constant definitions
└── public/              # Static resources
```

## Main Features

1. **Create Time Capsule Letters**: Users can create letters containing text and attachments, and set specific future time points. Letters will be encrypted using `Seal` and stored on the `Sui` chain and `Walrus`
2. **Receive and View Letters**: Recipients can only view letter content after the set time has been reached
3. **Multi-language Support**: The application supports multiple language interfaces
4. **Wallet Integration**: Seamless integration with Sui wallets

## Contribution Guidelines

Contributions of code, issue reports, or improvement suggestions are welcome. Please follow these steps:

1. Fork the project
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact Information

- Project Maintainer: X@jasonruan <rzexin@gmail.com>
- Project Link: [https://github.com/rzexin/mandy](https://github.com/rzexin/mandy) 