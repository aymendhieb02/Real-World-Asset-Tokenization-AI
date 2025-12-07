"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "December 6, 2024";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="text-neon-cyan mr-3" size={48} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-foreground/70">
            Last updated: {lastUpdated}
          </p>
        </div>

        <Card className="bg-background/30 border-white/10">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">1. Introduction</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Welcome to NeuralEstate AI ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our platform, which provides blockchain-based real estate tokenization services powered by artificial intelligence.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                By accessing or using NeuralEstate AI, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the platform.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">2. Definitions</h2>
              <ul className="space-y-3 text-foreground/80">
                <li>
                  <strong>"Platform"</strong> refers to the NeuralEstate AI website, mobile application, and all related services.
                </li>
                <li>
                  <strong>"Tokens"</strong> refers to blockchain-based digital tokens representing fractional ownership in real estate properties.
                </li>
                <li>
                  <strong>"Smart Contracts"</strong> refers to self-executing contracts deployed on the Polygon blockchain that govern token transactions.
                </li>
                <li>
                  <strong>"Property"</strong> refers to real estate assets that have been tokenized and made available on our platform.
                </li>
                <li>
                  <strong>"User"</strong> or <strong>"You"</strong> refers to any individual or entity accessing or using the Platform.
                </li>
              </ul>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">3. Eligibility and Account Registration</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  <strong>3.1 Age Requirement:</strong> You must be at least 18 years old to use our Platform. By using the Platform, you represent and warrant that you meet this age requirement.
                </p>
                <p>
                  <strong>3.2 Account Creation:</strong> To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
                <p>
                  <strong>3.3 KYC/AML Compliance:</strong> You must complete Know Your Customer (KYC) and Anti-Money Laundering (AML) verification before making investments. We reserve the right to refuse service to anyone who fails verification.
                </p>
              </div>
            </section>

            {/* Blockchain and Smart Contracts */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">4. Blockchain Technology and Smart Contracts</h2>
              <div className="space-y-4 text-foreground/80">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="text-yellow-400 mt-1" size={20} />
                    <div>
                      <strong className="text-yellow-400">Important:</strong>
                      <p className="mt-2">
                        Transactions on the blockchain are irreversible. Once executed, smart contracts cannot be modified or reversed. You are solely responsible for verifying transaction details before confirming.
                      </p>
                    </div>
                  </div>
                </div>
                <p>
                  <strong>4.1 Smart Contract Execution:</strong> All token transactions are executed through smart contracts on the Polygon blockchain. These contracts are immutable once deployed and operate autonomously.
                </p>
                <p>
                  <strong>4.2 Wallet Security:</strong> You are solely responsible for securing your cryptocurrency wallet, private keys, and seed phrases. NeuralEstate cannot recover lost wallets or stolen private keys. We recommend using hardware wallets for significant holdings.
                </p>
                <p>
                  <strong>4.3 Network Fees:</strong> Blockchain transactions require payment of network fees (gas fees). These fees are paid directly to the network and are not controlled by NeuralEstate. Fees vary based on network congestion.
                </p>
                <p>
                  <strong>4.4 Network Risks:</strong> The Platform operates on blockchain networks that may experience congestion, forks, or other technical issues. We are not responsible for losses resulting from network issues beyond our control.
                </p>
              </div>
            </section>

            {/* Investment Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">5. Investment Terms</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  <strong>5.1 No Investment Advice:</strong> NeuralEstate does not provide investment, financial, legal, or tax advice. All investment decisions are your own. You should consult with qualified professionals before making investment decisions.
                </p>
                <p>
                  <strong>5.2 Investment Risks:</strong> Real estate investments carry inherent risks, including but not limited to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Market volatility and property value fluctuations</li>
                  <li>Liquidity risks (tokens may not be easily sold)</li>
                  <li>Regulatory changes affecting tokenized assets</li>
                  <li>Property-specific risks (damage, tenant issues, etc.)</li>
                  <li>Smart contract vulnerabilities or exploits</li>
                </ul>
                <p>
                  <strong>5.3 No Guarantees:</strong> Past performance does not guarantee future results. We make no guarantees regarding investment returns, property values, or token liquidity.
                </p>
                <p>
                  <strong>5.4 Token Ownership:</strong> Token ownership grants you fractional ownership rights in the underlying property as defined in the property's legal documentation. Ownership is recorded on the blockchain and governed by smart contracts.
                </p>
              </div>
            </section>

            {/* Fees and Payments */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">6. Fees and Payments</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  <strong>6.1 Platform Fees:</strong> We charge fees for various services, including property tokenization, transaction processing, and platform maintenance. All fees are disclosed before you complete a transaction.
                </p>
                <p>
                  <strong>6.2 Payment Methods:</strong> Payments are processed through cryptocurrency transactions on the Polygon blockchain. We accept USDC, ETH, and other supported cryptocurrencies.
                </p>
                <p>
                  <strong>6.3 Refund Policy:</strong> Due to the irreversible nature of blockchain transactions, all purchases are final. Refunds are only available in exceptional circumstances as determined by us in our sole discretion.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">7. Intellectual Property</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  <strong>7.1 Platform Content:</strong> All content on the Platform, including text, graphics, logos, software, and AI models, is owned by NeuralEstate or its licensors and protected by intellectual property laws.
                </p>
                <p>
                  <strong>7.2 Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial purposes.
                </p>
                <p>
                  <strong>7.3 Restrictions:</strong> You may not copy, modify, distribute, sell, or lease any part of the Platform without our written permission.
                </p>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">8. Prohibited Activities</h2>
              <p className="text-foreground/80 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-foreground/80">
                <li>Use the Platform for any illegal purpose or in violation of any laws</li>
                <li>Engage in money laundering, terrorist financing, or other financial crimes</li>
                <li>Manipulate token prices or engage in market manipulation</li>
                <li>Attempt to hack, disrupt, or interfere with the Platform or blockchain networks</li>
                <li>Use automated systems to access the Platform without authorization</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Violate any applicable securities laws or regulations</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">9. Limitation of Liability</h2>
              <div className="space-y-4 text-foreground/80">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="text-red-400 mt-1" size={20} />
                    <div>
                      <strong className="text-red-400">Disclaimer:</strong>
                      <p className="mt-2">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEURALESTATE AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE PLATFORM.
                      </p>
                    </div>
                  </div>
                </div>
                <p>
                  Our total liability for any claims arising from your use of the Platform shall not exceed the amount you paid to us in the 12 months preceding the claim.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">10. Indemnification</h2>
              <p className="text-foreground/80">
                You agree to indemnify, defend, and hold harmless NeuralEstate AI, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Platform, violation of these Terms, or infringement of any rights of another party.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">11. Termination</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  <strong>11.1 By You:</strong> You may terminate your account at any time by contacting support. Note that termination does not affect your token ownership or obligations under existing smart contracts.
                </p>
                <p>
                  <strong>11.2 By Us:</strong> We may suspend or terminate your access to the Platform immediately, without prior notice, if you violate these Terms or engage in fraudulent or illegal activities.
                </p>
                <p>
                  <strong>11.3 Effect of Termination:</strong> Upon termination, your right to access the Platform ceases, but your token ownership and rights under smart contracts remain unaffected.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">12. Governing Law and Dispute Resolution</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  <strong>12.1 Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
                </p>
                <p>
                  <strong>12.2 Dispute Resolution:</strong> Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with [Arbitration Rules], except where prohibited by law.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">13. Changes to Terms</h2>
              <p className="text-foreground/80">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notification. Your continued use of the Platform after changes become effective constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">14. Contact Information</h2>
              <p className="text-foreground/80">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                <p className="font-semibold">NeuralEstate AI</p>
                <p>Email: legal@neuralestate.ai</p>
                <p>Support: support@neuralestate.ai</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

