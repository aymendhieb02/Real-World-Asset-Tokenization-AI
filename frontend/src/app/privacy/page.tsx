"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Key } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "December 6, 2024";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-neon-cyan mr-3" size={48} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Privacy Policy
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
              <p className="text-foreground/80 leading-relaxed">
                NeuralEstate AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-based real estate tokenization platform.
              </p>
              <p className="text-foreground/80 leading-relaxed mt-4">
                By using our Platform, you consent to the data practices described in this policy. Please read this Privacy Policy carefully to understand our practices regarding your personal data.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan flex items-center">
                <Database className="mr-2" size={24} />
                2. Information We Collect
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
                  <p className="text-foreground/80 mb-3">We collect information that you provide directly to us:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-foreground/80">
                    <li><strong>Identity Information:</strong> Name, date of birth, government-issued ID, passport, or driver's license</li>
                    <li><strong>Contact Information:</strong> Email address, phone number, mailing address</li>
                    <li><strong>Financial Information:</strong> Bank account details, payment card information (processed through secure third-party providers)</li>
                    <li><strong>KYC/AML Data:</strong> Information required for identity verification and compliance</li>
                    <li><strong>Account Information:</strong> Username, password (hashed), security questions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.2 Blockchain Information</h3>
                  <p className="text-foreground/80 mb-3">Due to the public nature of blockchain technology:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-foreground/80">
                    <li><strong>Wallet Addresses:</strong> Public wallet addresses you connect to our Platform</li>
                    <li><strong>Transaction History:</strong> All blockchain transactions are publicly visible and immutable</li>
                    <li><strong>Token Holdings:</strong> Your token balances and ownership records on the blockchain</li>
                    <li><strong>Smart Contract Interactions:</strong> Records of your interactions with our smart contracts</li>
                  </ul>
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-foreground/80">
                      <strong className="text-yellow-400">Important:</strong> Blockchain transactions are permanent and publicly visible. Once a transaction is recorded on the blockchain, it cannot be deleted or modified.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.3 Automatically Collected Information</h3>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-foreground/80">
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, search queries</li>
                    <li><strong>Location Data:</strong> General location based on IP address (not precise GPS)</li>
                    <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies (see Section 6)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan flex items-center">
                <Eye className="mr-2" size={24} />
                3. How We Use Your Information
              </h2>
              <p className="text-foreground/80 mb-4">We use collected information for the following purposes:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-foreground/80">
                <li><strong>Service Provision:</strong> To provide, maintain, and improve our Platform and services</li>
                <li><strong>Identity Verification:</strong> To conduct KYC/AML checks and verify your identity</li>
                <li><strong>Transaction Processing:</strong> To process investments, token purchases, and dividend distributions</li>
                <li><strong>Compliance:</strong> To comply with legal obligations, including anti-money laundering and securities regulations</li>
                <li><strong>Security:</strong> To detect, prevent, and address fraud, security breaches, and other harmful activities</li>
                <li><strong>Communication:</strong> To send you updates, notifications, and respond to your inquiries</li>
                <li><strong>Analytics:</strong> To analyze usage patterns and improve user experience</li>
                <li><strong>Legal Requirements:</strong> To comply with court orders, legal processes, or government requests</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">4. Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-foreground/80">
                <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">4.1 Service Providers</h3>
                  <p>We share information with third-party service providers who perform services on our behalf:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    <li>KYC/AML verification providers</li>
                    <li>Payment processors and financial institutions</li>
                    <li>Cloud hosting and infrastructure providers</li>
                    <li>Analytics and monitoring services</li>
                    <li>Customer support platforms</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4.2 Legal Requirements</h3>
                  <p>We may disclose information when required by law or to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    <li>Comply with legal processes, subpoenas, or court orders</li>
                    <li>Respond to government or regulatory requests</li>
                    <li>Enforce our Terms of Service</li>
                    <li>Protect our rights, property, or safety, or that of our users</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4.3 Business Transfers</h3>
                  <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4.4 Blockchain Transparency</h3>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mt-2">
                    <p>
                      <strong className="text-blue-400">Blockchain Public Nature:</strong> Information recorded on the blockchain (wallet addresses, transactions, token holdings) is publicly visible and cannot be hidden or deleted. This is an inherent characteristic of blockchain technology.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan flex items-center">
                <Lock className="mr-2" size={24} />
                5. Data Security
              </h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Encryption:</strong> Data in transit is encrypted using TLS/SSL protocols</li>
                  <li><strong>Secure Storage:</strong> Sensitive data is encrypted at rest</li>
                  <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                  <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                  <li><strong>Smart Contract Audits:</strong> Regular security audits of our blockchain smart contracts</li>
                </ul>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mt-4">
                  <p>
                    <strong className="text-red-400">Important:</strong> No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security. You are responsible for securing your wallet and private keys.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">6. Cookies and Tracking Technologies</h2>
              <div className="space-y-4 text-foreground/80">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze Platform usage and performance</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Ensure Platform security</li>
                </ul>
                <p>You can control cookies through your browser settings, but disabling cookies may limit Platform functionality.</p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan flex items-center">
                <Key className="mr-2" size={24} />
                7. Your Privacy Rights
              </h2>
              <div className="space-y-4 text-foreground/80">
                <p>Depending on your jurisdiction, you may have the following rights:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal and contractual obligations)</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                </ul>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mt-4">
                  <p>
                    <strong className="text-yellow-400">Blockchain Limitation:</strong> Information recorded on the blockchain cannot be deleted or modified due to the immutable nature of blockchain technology. We can only remove off-chain personal information.
                  </p>
                </div>
                <p className="mt-4">
                  To exercise these rights, contact us at <strong className="text-neon-cyan">privacy@neuralestate.ai</strong>
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">8. Data Retention</h2>
              <p className="text-foreground/80">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. KYC/AML information is typically retained for 5-7 years after account closure to comply with regulatory requirements.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">9. International Data Transfers</h2>
              <p className="text-foreground/80">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">10. Children's Privacy</h2>
              <p className="text-foreground/80">
                Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">11. Changes to This Privacy Policy</h2>
              <p className="text-foreground/80">
                We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a prominent notice on our Platform. Your continued use of the Platform after changes become effective constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">12. Contact Us</h2>
              <p className="text-foreground/80 mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                <p className="font-semibold">NeuralEstate AI - Privacy Team</p>
                <p>Email: privacy@neuralestate.ai</p>
                <p>Data Protection Officer: dpo@neuralestate.ai</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

