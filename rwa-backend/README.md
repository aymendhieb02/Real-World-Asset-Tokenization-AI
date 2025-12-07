# RWA Backend - Real Estate Tokenization Platform

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-11.0-red?style=for-the-badge&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)

**NestJS Backend API for Real-World Asset Tokenization Platform**

*Secure, Scalable, and Production-Ready*

</div>

---

## 🌟 Overview

This is the backend API for the RWA (Real-World Asset) tokenization platform. Built with NestJS, it provides a comprehensive RESTful API for property tokenization, KYC verification, blockchain integration, and AI-powered features.

### Key Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🏠 **Property Management** - CRUD operations for tokenized properties
- 📄 **AI Document Processing** - PDF parsing with Claude AI extraction
- ✅ **KYC System** - Complete Know Your Customer verification workflow
- ⛓️ **Blockchain Integration** - Web3 integration with ERC-1400 security tokens
- 🤖 **AI Recommendations** - Portfolio analysis and property suggestions
- 📦 **IPFS Storage** - Decentralized document storage
- 📚 **Swagger Documentation** - Interactive API documentation

## 🛠 Technology Stack

### Core Framework
- **NestJS 11** - Progressive Node.js framework
- **TypeScript 5.7** - Type-safe development
- **Express** - HTTP server framework

### Database & ORM
- **PostgreSQL** - Relational database
- **Prisma 5.22** - Next-generation ORM

### Authentication & Security
- **JWT** - JSON Web Tokens for authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing

### Blockchain & Web3
- **ethers.js 6.16** - Ethereum library
- **IPFS** - InterPlanetary File System for decentralized storage

### AI & Machine Learning
- **Anthropic Claude API** - AI-powered document extraction
- **Custom ML Integration** - Property price prediction

### API Documentation
- **Swagger/OpenAPI** - Interactive API documentation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** or **yarn**
- **PostgreSQL** >= 14
- **Git**

### Required API Keys

- **Anthropic API Key** - For AI document extraction
- **Ethereum RPC URL** - Sepolia testnet or mainnet
- **IPFS Credentials** (Optional) - Infura or local IPFS node
- **JWT Secret** - For token signing

## 🚀 Getting Started

### 1. Installation

```bash
# Navigate to backend directory
cd rwa-backend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `rwa-backend` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rwa_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3002
NODE_ENV=development

# Anthropic AI
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Blockchain
ETHEREUM_RPC_URL="https://sepolia.infura.io/v3/your-infura-key"
PRIVATE_KEY="your-private-key-for-transactions"
KYC_REGISTRY_ADDRESS="0xA5Ac3bb57a3CDa813C2cdc26F56C60e564a7ecDb"
PROPERTY_TOKEN_ADDRESS="0xe501022Bf838D2E40217fA17E30e874ab25C51Ea"
MARKETPLACE_ADDRESS="0x1994581a4Df6f47BC70116F48A66981B603D38AF"

# IPFS (Optional)
IPFS_PROJECT_ID="your-ipfs-project-id"
IPFS_PROJECT_SECRET="your-ipfs-secret"
IPFS_GATEWAY="https://ipfs.infura.io:5001"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 4. Start Development Server

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at:
- **API Base URL**: `http://localhost:3002/api`
- **Swagger Documentation**: `http://localhost:3002/api/docs`

## 📁 Project Structure

```
rwa-backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── guards/       # JWT guards
│   │   ├── strategies/   # Passport strategies
│   │   └── *.ts
│   ├── users/            # User management
│   ├── properties/       # Property CRUD and tokenization
│   ├── kyc/              # KYC verification system
│   ├── blockchain/       # Web3 integration
│   ├── ai/               # AI recommendations
│   ├── documents/        # PDF processing and IPFS
│   ├── prisma/           # Prisma service
│   ├── common/           # Shared utilities
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/           # Configuration
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── test/                 # E2E tests
├── dist/                 # Compiled output
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Properties

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/properties` | Get all properties | No |
| GET | `/api/properties/:id` | Get property by ID | No |
| POST | `/api/properties` | Create new property | Yes |
| POST | `/api/properties/create-from-pdf` | Create property from PDF | Yes |
| PUT | `/api/properties/:id` | Update property | Yes |
| DELETE | `/api/properties/:id` | Delete property | Yes |
| POST | `/api/properties/:id/upload-document` | Upload property document | Yes |
| GET | `/api/properties/:id/documents` | Get property documents | No |

### KYC (Know Your Customer)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/kyc/submit` | Submit KYC data | Yes |
| GET | `/api/kyc/status` | Get user's KYC status | Yes |
| GET | `/api/kyc/status-by-wallet/:address` | Get KYC by wallet | No |
| POST | `/api/kyc/auto-verify-by-wallet` | Auto-verify KYC | Yes |
| GET | `/api/kyc/pending` | Get pending KYC (Admin) | Yes |
| PUT | `/api/kyc/:id/status` | Update KYC status (Admin) | Yes |
| POST | `/api/kyc/:id/verify-on-chain` | Verify on blockchain | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| GET | `/api/users/holdings` | Get user holdings | Yes |
| GET | `/api/users/transactions` | Get user transactions | Yes |
| PUT | `/api/users/wallet` | Update wallet address | Yes |

### Blockchain

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blockchain/network/status` | Check network status | No |
| GET | `/api/blockchain/kyc/:address` | Check KYC on chain | No |
| POST | `/api/blockchain/properties/:id/tokenize` | Tokenize property | Yes |
| GET | `/api/blockchain/properties/:id/token-info` | Get token info | No |
| POST | `/api/blockchain/marketplace/buy` | Buy tokens | Yes |
| POST | `/api/blockchain/marketplace/sell` | Sell tokens | Yes |

### AI

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ai/portfolio-analysis` | Analyze user portfolio | Yes |
| GET | `/api/ai/recommendations` | Get property recommendations | Yes |

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Example Request

```bash
curl -X GET http://localhost:3002/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📊 Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User** - User accounts with roles (investor, owner, admin)
- **Property** - Tokenized real estate properties
- **KycData** - KYC verification information
- **PropertyDocument** - Property documents with AI extraction
- **UserHolding** - User token holdings
- **Transaction** - Blockchain transactions
- **AiRecommendation** - AI-generated recommendations

See `prisma/schema.prisma` for the complete schema.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🚢 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment. Use a secure secret management system.

### Database Migrations

```bash
# Run migrations in production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## 🔧 Smart Contract Addresses (Sepolia Testnet)

- **KYCRegistry**: `0xA5Ac3bb57a3CDa813C2cdc26F56C60e564a7ecDb`
- **PropertySecurityToken**: `0xe501022Bf838D2E40217fA17E30e874ab25C51Ea`
- **Marketplace**: `0x1994581a4Df6f47BC70116F48A66981B603D38AF`

## 📚 API Documentation

Interactive API documentation is available at `/api/docs` when the server is running. The Swagger UI provides:

- Complete endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Authentication testing

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure token-based authentication
- **Input Validation** - class-validator for DTOs
- **CORS** - Configurable cross-origin resource sharing
- **SQL Injection Protection** - Prisma ORM parameterized queries
- **Rate Limiting** - (Recommended to add in production)

## 🔗 Integration with Other Services

This backend integrates with:

- **Frontend** (Next.js) - Main user interface
- **ML API** (FastAPI) - Machine learning models for price prediction
- **Education Service** (FastAPI) - AI-powered education system
- **House Info Extractor** (Flask) - PDF document extraction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**Retro Reality** - Hackathon Team

---

<div align="center">

**Built with ❤️ using NestJS**

⭐ Star this repo if you find it helpful!

</div>
