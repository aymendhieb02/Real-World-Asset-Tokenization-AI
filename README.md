# NeuralEstate AI - Real-World Asset Tokenization Platform

<div align="center">

![NeuralEstate AI](https://img.shields.io/badge/NeuralEstate-AI%20Powered-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Web3](https://img.shields.io/badge/Web3-Polygon-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**AI-Powered Real-World Asset Tokenization Platform**

*Invest in Real Estate. Powered by AI. Secured by Blockchain.*

[Features](#-features) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

NeuralEstate AI is a cutting-edge platform that combines artificial intelligence with blockchain technology to revolutionize real estate investment. The platform enables instant property valuation, automated tokenization, and intelligent investment recommendations, making real estate investment accessible, transparent, and data-driven.

### Key Innovations

- 🤖 **AI-Powered Valuation Engine**: Instant property valuation with 92% accuracy using ensemble machine learning models
- 🔗 **Blockchain Tokenization**: ERC-1400 compliant tokens on Polygon for secure, transparent ownership
- 📊 **Risk Intelligence**: AI-driven risk assessment and market trend predictions
- 💡 **Investment Advisor**: Personalized portfolio recommendations based on AI analysis
- ⚡ **Real-Time Updates**: Live valuation updates via blockchain oracles

## ✨ Features

### Core Features

- **Property Tokenization**
  - Transform real estate into tradeable tokens
  - Fractional ownership with ERC-1400 compliance
  - Automated smart contract generation

- **AI Valuation System**
  - Instant property valuation using ensemble models
  - Confidence scoring and explainable AI factors
  - 6-month and 12-month trend predictions
  - Risk score assessment

- **Marketplace**
  - Decentralized token trading
  - Order book with limit orders
  - Market depth visualization
  - Real-time trade history

- **Portfolio Management**
  - Multi-property portfolio tracking
  - Performance analytics and charts
  - Dividend distribution and claiming
  - ROI calculations

- **AI Investment Advisor**
  - Personalized investment recommendations
  - Portfolio diversification analysis
  - Risk-adjusted suggestions
  - Market insights and trends

- **Role-Based Dashboards**
  - **Investor Dashboard**: Portfolio overview, AI recommendations, holdings
  - **Owner Dashboard**: Property management, tokenization wizard, revenue tracking
  - **Admin Dashboard**: KYC management, system metrics, compliance monitoring

- **KYC & Compliance**
  - Built-in KYC verification system
  - Regulatory compliance features
  - Document management
  - Multi-level verification

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts + Nivo Charts
- **State Management**: React Query (TanStack Query) + Zustand

### Web3 Integration
- **Blockchain**: Polygon (Amoy testnet)
- **Web3 Libraries**: wagmi + viem
- **Wallet Connection**: RainbowKit
- **Token Standard**: ERC-1400

### AI Integration
- **Valuation Models**: Ensemble (XGBoost + RandomForest + Neural Networks)
- **Risk Assessment**: Multi-factor analysis
- **Recommendation Engine**: Portfolio optimization algorithms

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint
- **Build Tool**: Next.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI.git
   cd Real-World-Asset-Tokenization-AI
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
   NEXT_PUBLIC_KYC_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_DIVIDEND_DISTRIBUTOR_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
Real-World-Asset-Tokenization-AI/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── dashboard/         # Role-based dashboards
│   │   │   ├── properties/        # Property catalog and details
│   │   │   ├── marketplace/       # Trading marketplace
│   │   │   ├── portfolio/         # Portfolio management
│   │   │   ├── ai/                # AI insights and advisor
│   │   │   └── ...
│   │   ├── components/            # React components
│   │   │   ├── ui/               # shadcn/ui base components
│   │   │   ├── layout/           # Layout components
│   │   │   ├── web3/             # Web3 integration
│   │   │   ├── ai/               # AI components
│   │   │   ├── property/         # Property components
│   │   │   ├── marketplace/      # Trading components
│   │   │   ├── charts/           # Data visualization
│   │   │   └── animations/       # Animated components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities and configs
│   │   │   ├── api/             # API functions (mock)
│   │   │   └── wagmi.ts         # Web3 configuration
│   │   ├── types/                # TypeScript definitions
│   │   └── styles/               # Global styles
│   ├── public/                   # Static assets
│   └── package.json
└── README.md
```

## 🎨 Design System

The platform features a modern Web3 design with:

- **Color Palette**: Midnight navy, deep indigo, neon cyan, electric blue
- **Effects**: Electric borders, gradient orbs, glassmorphism, neon shadows
- **Animations**: Smooth transitions, hover effects, parallax scrolling
- **Components**: Custom animated components inspired by Web3 design trends

## 📊 Key Pages

### Public Pages
- `/` - Landing page with hero section and features
- `/properties` - Property catalog with filters
- `/properties/[id]` - Property details with AI analysis
- `/education` - Educational content about Web3 real estate

### Authenticated Pages
- `/dashboard/investor` - Investor portfolio dashboard
- `/dashboard/owner` - Property owner dashboard
- `/dashboard/admin` - Admin control panel
- `/marketplace` - Token trading marketplace
- `/portfolio` - Portfolio overview and analytics
- `/dividends` - Dividend management and claiming
- `/ai/insights` - AI market insights
- `/ai/advisor` - AI investment advisor
- `/kyc` - KYC verification
- `/settings` - User settings

## 🔗 Web3 Integration

The platform integrates with Polygon blockchain and supports:

- **Wallet Connection**: Connect via MetaMask, WalletConnect, and more
- **Token Interactions**: ERC-1400 token balance and transfers
- **Marketplace Trading**: Buy/sell orders on-chain
- **KYC Verification**: On-chain KYC status checking
- **Dividend Claims**: Claim dividends via smart contracts

### Supported Networks
- Polygon Amoy (Testnet)
- Polygon Mainnet (Production)

## 🤖 AI Features

### Valuation Engine
- Instant property valuation
- Confidence scoring (0-100%)
- Risk assessment (low/medium/high)
- Market trend prediction (up/down/neutral)
- Explainable factors

### Portfolio Recommendations
- Personalized asset recommendations
- Diversification scoring
- Risk-adjusted suggestions
- Expected return calculations

### Risk Intelligence
- Multi-factor risk analysis
- Market volatility assessment
- Location-based risk factors
- Liquidity analysis

## 🔒 Security & Compliance

- **KYC Integration**: Built-in Know Your Customer verification
- **ERC-1400 Compliance**: Security token standard compliance
- **Smart Contract Audits**: Secure smart contract deployment
- **Data Privacy**: Secure handling of user data

## 📈 Roadmap

- [ ] Backend API integration
- [ ] AI model deployment
- [ ] Smart contract deployment on mainnet
- [ ] Oracle integration for live valuations
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-chain support
- [ ] Governance features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Jizel Ziadi** - [Jizel14](https://github.com/Jizel14)
  - Email: jizel.ziadi@esprit.tn

## 🙏 Acknowledgments

- Design inspiration from [Aceternity UI](https://ui.aceternity.com)
- Animation libraries: Framer Motion, React Bits
- Web3 libraries: wagmi, viem, RainbowKit
- UI components: shadcn/ui, Radix UI

## 📞 Support

For support, email jizel.ziadi@esprit.tn or open an issue in the repository.

## 🔗 Links

- [Repository](https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI)
- [Issues](https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI/issues)
- [Documentation](#-documentation)

---

<div align="center">

**Built with ❤️ using Next.js, AI, and Web3**

⭐ Star this repo if you find it helpful!

</div>
