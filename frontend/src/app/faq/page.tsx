"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "blockchain" | "investment" | "technical";
}

const faqs: FAQItem[] = [
  // General
  {
    category: "general",
    question: "What is NeuralEstate AI?",
    answer: "NeuralEstate AI is an AI-powered platform that tokenizes real-world assets (RWAs), specifically real estate properties, on the blockchain. We combine artificial intelligence with blockchain technology to make real estate investment more accessible, transparent, and efficient."
  },
  {
    category: "general",
    question: "How does real estate tokenization work?",
    answer: "Real estate tokenization involves converting ownership rights of a property into digital tokens on a blockchain. Each token represents a fractional share of the property. Investors can buy, sell, and trade these tokens, providing liquidity and accessibility to real estate investments that were previously limited to high-net-worth individuals."
  },
  {
    category: "general",
    question: "What are the benefits of tokenized real estate?",
    answer: "Tokenized real estate offers several advantages: fractional ownership (invest with smaller amounts), increased liquidity (trade tokens on secondary markets), transparency (blockchain records all transactions), lower barriers to entry, automated dividend distribution, and global accessibility without traditional intermediaries."
  },
  
  // Blockchain
  {
    category: "blockchain",
    question: "Which blockchain does NeuralEstate use?",
    answer: "NeuralEstate currently operates on Polygon (Polygon Amoy testnet for development). We chose Polygon for its low transaction fees, fast confirmation times, and Ethereum compatibility. This ensures cost-effective transactions while maintaining security and interoperability with the broader Ethereum ecosystem."
  },
  {
    category: "blockchain",
    question: "Are my tokens secure on the blockchain?",
    answer: "Yes. All tokens are secured by smart contracts deployed on Polygon, which is secured by Ethereum's proof-of-stake consensus mechanism. Our smart contracts are audited, and token ownership is recorded immutably on the blockchain. However, you must secure your private keys and wallet - we cannot recover lost wallets or stolen private keys."
  },
  {
    category: "blockchain",
    question: "What is a smart contract and how does it protect investors?",
    answer: "A smart contract is self-executing code on the blockchain that automatically enforces the terms of an agreement. Our smart contracts handle token issuance, ownership transfers, dividend distribution, and compliance checks. They eliminate the need for intermediaries and ensure transparent, automated execution of all investment terms."
  },
  {
    category: "blockchain",
    question: "Can I transfer my tokens to another wallet?",
    answer: "Yes, tokens are ERC-20 compatible and can be transferred to any Ethereum-compatible wallet. However, transfers may be subject to compliance checks and lock-up periods depending on the specific property's terms. Always verify the receiving address before transferring tokens."
  },
  {
    category: "blockchain",
    question: "What happens if the blockchain network is down?",
    answer: "Blockchain networks like Polygon are decentralized and highly resilient. While temporary network congestion can occur, complete network failures are extremely rare. In the unlikely event of network issues, your tokens remain secure in your wallet and will be accessible once the network resumes normal operation."
  },
  
  // Investment
  {
    category: "investment",
    question: "What is the minimum investment amount?",
    answer: "The minimum investment varies by property, but tokenization allows for fractional ownership starting from as low as $100. This makes real estate investment accessible to a much broader range of investors compared to traditional real estate purchases."
  },
  {
    category: "investment",
    question: "How do I receive rental income or dividends?",
    answer: "Rental income and property profits are automatically distributed to token holders through our smart contract system. Dividends are paid in cryptocurrency (USDC or ETH) directly to your connected wallet address, proportional to your token ownership. Distributions typically occur monthly or quarterly, depending on the property."
  },
  {
    category: "investment",
    question: "Can I sell my tokens at any time?",
    answer: "Token liquidity depends on the specific property's terms. Some properties may have lock-up periods, while others allow immediate trading on secondary markets. Our platform provides a marketplace where you can list your tokens for sale. However, liquidity is not guaranteed and depends on market demand."
  },
  {
    category: "investment",
    question: "What are the fees associated with investing?",
    answer: "NeuralEstate charges a small platform fee (typically 2-3%) on property purchases, plus blockchain transaction fees (gas fees) for token transfers. There are no ongoing management fees - all property management costs are deducted from rental income before distribution. Always review the fee structure for each property before investing."
  },
  {
    category: "investment",
    question: "How are properties selected for tokenization?",
    answer: "Our AI-powered system analyzes properties based on multiple factors: location, rental yield potential, market trends, property condition, and risk assessment. Properties undergo due diligence including legal verification, property inspection, and financial analysis before being approved for tokenization."
  },
  {
    category: "investment",
    question: "What happens if a property is sold?",
    answer: "If a property is sold, the proceeds are distributed to token holders proportionally based on their token ownership. The smart contract automatically calculates and distributes the sale proceeds, minus any outstanding debts or fees, directly to token holders' wallets."
  },
  
  // Technical
  {
    category: "technical",
    question: "Do I need to understand blockchain technology to invest?",
    answer: "No, you don't need deep technical knowledge. Our platform provides a user-friendly interface that abstracts away most blockchain complexity. However, you should understand basic concepts like wallets, private keys, and cryptocurrency. We offer educational resources to help you get started."
  },
  {
    category: "technical",
    question: "What wallet should I use?",
    answer: "We recommend using MetaMask, Rainbow, or other reputable Ethereum-compatible wallets. The wallet must support Polygon network. Always download wallets from official sources and never share your private keys or seed phrase with anyone, including NeuralEstate support."
  },
  {
    category: "technical",
    question: "How does KYC (Know Your Customer) work?",
    answer: "To comply with regulations, we require identity verification before you can invest. Our KYC process uses blockchain-based verification where possible, storing only necessary information securely. You'll need to provide government-issued ID and proof of address. This is a one-time process per account."
  },
  {
    category: "technical",
    question: "What is the AI Price Prediction feature?",
    answer: "Our AI Price Prediction uses machine learning models trained on historical real estate data, market trends, economic indicators, and property characteristics to predict future property values. This helps investors make informed decisions, though predictions are estimates and not guarantees."
  },
  {
    category: "technical",
    question: "How does the AI Investment Advisor work?",
    answer: "The AI Investment Advisor analyzes your investment goals, risk tolerance, and portfolio to provide personalized recommendations. It considers factors like property location, expected returns, market conditions, and diversification needs to suggest suitable tokenized properties."
  },
  {
    category: "technical",
    question: "What is the Cluster Map feature?",
    answer: "The Cluster Map uses advanced clustering algorithms to identify property hotspots and investment opportunities. It groups properties by location, price range, and characteristics, helping you discover undervalued areas or emerging markets with high growth potential."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | FAQItem["category"]>("all");

  const filteredFAQs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const categories = [
    { id: "all" as const, label: "All Questions", count: faqs.length },
    { id: "general" as const, label: "General", count: faqs.filter(f => f.category === "general").length },
    { id: "blockchain" as const, label: "Blockchain", count: faqs.filter(f => f.category === "blockchain").length },
    { id: "investment" as const, label: "Investment", count: faqs.filter(f => f.category === "investment").length },
    { id: "technical" as const, label: "Technical", count: faqs.filter(f => f.category === "technical").length },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="text-neon-cyan mr-3" size={48} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Find answers to common questions about blockchain-based real estate tokenization, 
            investments, and our AI-powered platform.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedCategory === category.id
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                  : "border-white/20 hover:border-neon-cyan/50 text-foreground/70"
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFAQs.map((faq, index) => {
              const globalIndex = faqs.indexOf(faq);
              const isOpen = openIndex === globalIndex;
              
              return (
                <motion.div
                  key={globalIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-background/30 border-white/10 hover:border-neon-cyan/30 transition-colors">
                    <CardHeader
                      className="cursor-pointer"
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg pr-8">{faq.question}</CardTitle>
                        {isOpen ? (
                          <ChevronUp className="text-neon-cyan flex-shrink-0" size={24} />
                        ) : (
                          <ChevronDown className="text-foreground/50 flex-shrink-0" size={24} />
                        )}
                      </div>
                    </CardHeader>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0 pb-6">
                            <p className="text-foreground/80 leading-relaxed">{faq.answer}</p>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 bg-gradient-to-br from-midnight-navy to-deep-indigo border-neon-cyan/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-foreground/70 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/support"
              className="inline-block px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg hover:opacity-90 transition-opacity"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

