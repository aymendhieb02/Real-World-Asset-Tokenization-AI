# NeuralEstate AI - Frontend

A complete Next.js 14 frontend application for NeuralEstate AI - an AI-powered Real-World Asset tokenization platform.

## Features

- 🎨 Modern Web3 design with neon effects and animations
- 🔗 Full Web3 integration with wagmi, viem, and RainbowKit
- 🤖 AI-powered components for valuation, risk assessment, and recommendations
- 📊 Interactive charts and data visualization
- 🏠 Complete property management and marketplace
- 👥 Three role-based dashboards (Investor, Owner, Admin)
- 💰 Token trading and portfolio management
- 📱 Fully responsive design

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **Web3**: wagmi + viem + RainbowKit
- **State Management**: React Query (TanStack Query) + Zustand
- **Charts**: Recharts + Nivo Charts
- **Network**: Polygon Amoy testnet

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
NEXT_PUBLIC_KYC_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_DIVIDEND_DISTRIBUTOR_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui base components
│   │   ├── layout/            # Layout components
│   │   ├── web3/              # Web3 integration components
│   │   ├── ai/                # AI components
│   │   ├── property/          # Property-related components
│   │   ├── marketplace/       # Trading components
│   │   ├── charts/            # Chart components
│   │   └── animations/        # Animated components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and configurations
│   │   ├── api/              # Mock API functions
│   │   └── utils.ts          # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # Global styles
├── public/                    # Static assets
└── package.json
```

## Key Pages

- `/` - Landing page with hero section
- `/properties` - Properties catalog
- `/properties/[id]` - Property details with AI analysis
- `/marketplace` - Trading marketplace
- `/dashboard/investor` - Investor dashboard
- `/dashboard/owner` - Owner dashboard
- `/dashboard/admin` - Admin dashboard
- `/portfolio` - User portfolio
- `/dividends` - Dividends management
- `/kyc` - KYC verification
- `/ai/insights` - AI market insights
- `/ai/advisor` - AI investment advisor
- `/education` - Education center

## Web3 Integration

The frontend integrates with Polygon Amoy testnet and supports:

- Wallet connection via RainbowKit
- ERC-1400 token interactions
- Marketplace trading
- KYC verification
- Dividend claiming

## Mock Data

The application includes mock data for demonstration purposes. In production, replace the mock API functions in `src/lib/api/` with actual backend API calls.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The application can be deployed to Vercel, Netlify, or any platform that supports Next.js.

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
