"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Book, 
  Code, 
  Zap, 
  Shield, 
  Wallet, 
  Database,
  ChevronRight,
  ExternalLink,
  FileCode,
  Network,
  Box
} from "lucide-react";
import Link from "next/link";

interface DocSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  content: string;
  codeExample?: string;
}

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    description: "Quick start guide for developers and investors",
    content: `# Getting Started with NeuralEstate AI

## Overview
NeuralEstate AI is a blockchain-based platform for real estate tokenization built on Polygon. Our platform combines AI-powered analytics with smart contract automation to make real estate investment accessible and transparent.

## Key Features
- **Tokenized Real Estate**: Fractional ownership through ERC-20 tokens
- **AI Analytics**: Machine learning models for price prediction and investment advice
- **Smart Contracts**: Automated dividend distribution and compliance
- **DeFi Integration**: Compatible with Ethereum ecosystem

## Prerequisites
- Web3 wallet (MetaMask, Rainbow, etc.)
- Polygon network configured
- Basic understanding of blockchain and DeFi
- KYC verification completed`,
    codeExample: `// Connect to Polygon Network
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);

// Get signer
const signer = provider.getSigner();
const address = await signer.getAddress();`
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts",
    icon: Box,
    description: "Smart contract architecture and interaction",
    content: `# Smart Contracts

## Architecture
Our platform uses a modular smart contract architecture:

### Core Contracts
1. **PropertyToken (ERC-20)**: Represents fractional ownership
2. **DividendDistributor**: Automated income distribution
3. **KYCRegistry**: Identity verification on-chain
4. **PropertyRegistry**: Property metadata and management

## Contract Addresses (Polygon Mainnet)
\`\`\`
PropertyTokenFactory: 0x...
DividendDistributor: 0x...
KYCRegistry: 0x...
\`\`\`

## Interacting with Contracts
All contracts follow ERC-20 standards and are compatible with standard DeFi protocols.`,
    codeExample: `// Example: Purchase Property Tokens
const propertyToken = new ethers.Contract(
  tokenAddress,
  PropertyTokenABI,
  signer
);

const tx = await propertyToken.purchaseTokens({
  value: ethers.utils.parseEther("1.0")
});
await tx.wait();`
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: Code,
    description: "REST API and GraphQL endpoints",
    content: `# API Reference

## Base URL
\`\`\`
Production: https://api.neuralestate.ai/v1
Testnet: https://api-testnet.neuralestate.ai/v1
\`\`\`

## Authentication
All API requests require authentication using API keys or JWT tokens.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.neuralestate.ai/v1/properties
\`\`\`

## Endpoints

### Properties
- \`GET /properties\` - List all properties
- \`GET /properties/:id\` - Get property details
- \`POST /properties/:id/invest\` - Make an investment

### Analytics
- \`GET /analytics/price-prediction\` - Get AI price prediction
- \`POST /analytics/advisor\` - Get investment recommendations

### User
- \`GET /user/portfolio\` - Get user portfolio
- \`GET /user/dividends\` - Get dividend history`
  },
  {
    id: "blockchain",
    title: "Blockchain Integration",
    icon: Network,
    description: "Polygon network setup and configuration",
    content: `# Blockchain Integration

## Network Configuration

### Polygon Mainnet
- **Network Name**: Polygon Mainnet
- **RPC URL**: https://polygon-rpc.com
- **Chain ID**: 137
- **Currency Symbol**: MATIC
- **Block Explorer**: https://polygonscan.com

### Polygon Amoy (Testnet)
- **Network Name**: Polygon Amoy
- **RPC URL**: https://rpc-amoy.polygon.technology
- **Chain ID**: 80002
- **Currency Symbol**: MATIC
- **Block Explorer**: https://amoy.polygonscan.com

## Adding Network to MetaMask
\`\`\`javascript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x89', // 137 in hex
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com']
  }]
});
\`\`\``
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    description: "Security best practices and audits",
    content: `# Security

## Smart Contract Audits
All smart contracts undergo comprehensive security audits:
- **Audit Firm**: [Audit Company Name]
- **Last Audit**: [Date]
- **Report**: [Link to audit report]

## Best Practices

### Wallet Security
1. **Use Hardware Wallets**: For significant holdings, use Ledger or Trezor
2. **Never Share Private Keys**: We will never ask for your private keys
3. **Verify Contract Addresses**: Always verify contract addresses before interacting
4. **Check Transaction Details**: Review all transactions before confirming

### Smart Contract Interaction
- Always verify you're interacting with official contracts
- Check contract source code on block explorers
- Start with small test transactions
- Be cautious of phishing attempts

## Bug Bounty
We offer rewards for responsibly disclosed security vulnerabilities. Contact security@neuralestate.ai`
  },
  {
    id: "sdk",
    title: "SDK & Libraries",
    icon: FileCode,
    description: "JavaScript/TypeScript SDK and examples",
    content: `# SDK & Libraries

## Installation
\`\`\`bash
npm install @neuralestate/sdk
# or
yarn add @neuralestate/sdk
\`\`\`

## Basic Usage
\`\`\`typescript
import { NeuralEstateSDK } from '@neuralestate/sdk';

const sdk = new NeuralEstateSDK({
  network: 'polygon',
  apiKey: 'your-api-key'
});

// Get all properties
const properties = await sdk.properties.list();

// Get property details
const property = await sdk.properties.get(propertyId);

// Purchase tokens
const tx = await sdk.invest.purchase({
  propertyId: propertyId,
  amount: '1.0', // ETH or MATIC
  wallet: signer
});

// Get portfolio
const portfolio = await sdk.user.getPortfolio(address);
\`\`\`

## TypeScript Support
Full TypeScript definitions are included for type safety.`
  }
];

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const selectedDoc = docSections.find(doc => doc.id === selectedSection);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Book className="text-neon-cyan mr-3" size={48} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Documentation
            </h1>
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Comprehensive guides, API references, and technical documentation for developers and investors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-background/30 border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {docSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                      selectedSection === section.id
                        ? "bg-neon-cyan/20 border border-neon-cyan/50"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <section.icon size={20} className="text-neon-cyan" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{section.title}</div>
                      <div className="text-xs text-foreground/60 mt-1">{section.description}</div>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform ${selectedSection === section.id ? 'rotate-90' : ''}`}
                    />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedDoc ? (
              <Card className="bg-background/30 border-white/10">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <selectedDoc.icon className="text-neon-cyan" size={24} />
                    <CardTitle className="text-2xl">{selectedDoc.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-foreground/80 font-mono text-sm bg-background/50 p-6 rounded-lg border border-white/10 overflow-x-auto">
                      {selectedDoc.content}
                    </pre>
                    {selectedDoc.codeExample && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Code Example</h3>
                        <pre className="bg-background/50 p-6 rounded-lg border border-white/10 overflow-x-auto">
                          <code className="text-sm text-foreground/80">{selectedDoc.codeExample}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-background/30 border-white/10">
                <CardContent className="p-12 text-center">
                  <Book className="mx-auto mb-4 text-foreground/30" size={64} />
                  <h2 className="text-2xl font-bold mb-2">Select a Documentation Section</h2>
                  <p className="text-foreground/60">
                    Choose a topic from the sidebar to view detailed documentation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-midnight-navy to-deep-indigo border-neon-cyan/30">
            <CardContent className="p-6">
              <Database className="text-neon-cyan mb-3" size={32} />
              <h3 className="font-bold mb-2">API Reference</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Complete API documentation with examples
              </p>
              <a href="#api-reference" className="text-neon-cyan text-sm flex items-center">
                View API Docs <ExternalLink className="ml-1" size={14} />
              </a>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-midnight-navy to-deep-indigo border-neon-cyan/30">
            <CardContent className="p-6">
              <Wallet className="text-neon-cyan mb-3" size={32} />
              <h3 className="font-bold mb-2">Integration Guide</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Step-by-step integration tutorials
              </p>
              <a href="#getting-started" className="text-neon-cyan text-sm flex items-center">
                Get Started <ExternalLink className="ml-1" size={14} />
              </a>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-midnight-navy to-deep-indigo border-neon-cyan/30">
            <CardContent className="p-6">
              <Shield className="text-neon-cyan mb-3" size={32} />
              <h3 className="font-bold mb-2">Security</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Security best practices and audit reports
              </p>
              <a href="#security" className="text-neon-cyan text-sm flex items-center">
                Learn More <ExternalLink className="ml-1" size={14} />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

