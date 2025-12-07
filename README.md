# NeuralEstate - Real-World Asset Tokenization Platform

<div align="center">

![NeuralEstate](https://img.shields.io/badge/NeuralEstate-Platform-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Web3](https://img.shields.io/badge/Web3-Polygon-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Real-World Asset Tokenization Platform**

*Invest in Real Estate. Secured by Blockchain.*

[Features](#-features) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started)

</div>

---

## 🌟 Overview

NeuralEstate is a platform for real estate tokenization that enables fractional ownership of properties. The platform provides a modern frontend interface for browsing properties, managing portfolios, and tracking investments.

### Key Features

- 🏠 **Property Catalog**: Browse tokenized real estate properties
- 💼 **Portfolio Management**: Track your property investments
- 🔗 **Blockchain Ready**: Web3 integration for future tokenization
- 📊 **Investment Tracking**: Monitor returns and performance
- 🎨 **Modern UI**: Beautiful, responsive design with Web3 aesthetics

## ✨ Features

### Core Features

- **Property Browsing**
  - View property listings with details
  - Filter and search properties
  - Property details with tokenomics

- **Portfolio Management**
  - Track your property investments
  - View portfolio performance
  - Monitor returns and dividends

- **Role-Based Dashboards**
  - **Investor Dashboard**: Portfolio overview and holdings
  - **Owner Dashboard**: Property management and revenue tracking
  - **Admin Dashboard**: KYC management and system metrics

- **Web3 Integration**
  - Wallet connection via RainbowKit
  - Token balance viewing
  - Ready for blockchain tokenization

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: React Query (TanStack Query) + Zustand

### Web3 Integration
- **Blockchain**: Polygon (Amoy testnet)
- **Web3 Libraries**: wagmi + viem
- **Wallet Connection**: RainbowKit

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
- MetaMask or compatible Web3 wallet (optional)

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

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
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
│   │   │   ├── portfolio/         # Portfolio management
│   │   │   └── ...
│   │   ├── components/            # React components
│   │   │   ├── ui/               # shadcn/ui base components
│   │   │   ├── layout/           # Layout components
│   │   │   ├── web3/             # Web3 integration
│   │   │   ├── property/         # Property components
│   │   │   ├── charts/           # Data visualization
│   │   │   └── animations/       # Animated components
│   │   ├── lib/                  # Utilities and configs
│   │   │   ├── api/             # Mock API functions
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
- `/properties/[id]` - Property details
- `/education` - Educational content about Web3 real estate

### Authenticated Pages
- `/dashboard/investor` - Investor portfolio dashboard
- `/dashboard/owner` - Property owner dashboard
- `/dashboard/admin` - Admin control panel
- `/portfolio` - Portfolio overview and analytics
- `/dividends` - Dividend management
- `/kyc` - KYC verification
- `/settings` - User settings

## 🔗 Web3 Integration

The platform integrates with Polygon blockchain and supports:

- **Wallet Connection**: Connect via MetaMask, WalletConnect, and more
- **Token Interactions**: View token balances
- **Network Support**: Polygon Amoy (Testnet)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Jizel Ziadi** - [Jizel14](https://github.com/Jizel14)
  - Email: jizel.ziadi@esprit.tn

---

<div align="center">

**Built with ❤️ using Next.js and Web3**

⭐ Star this repo if you find it helpful!

</div>
