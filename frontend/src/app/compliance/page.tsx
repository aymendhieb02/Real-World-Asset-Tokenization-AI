"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle2, AlertTriangle, FileCheck, Lock, Globe } from "lucide-react";

export default function CompliancePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-neon-cyan mr-3" size={48} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Compliance & Regulatory
            </h1>
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our commitment to regulatory compliance, security standards, and legal requirements in blockchain-based real estate tokenization.
          </p>
        </div>

        <div className="space-y-8">
          {/* Regulatory Compliance */}
          <Card className="bg-background/30 border-white/10">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <FileCheck className="text-neon-cyan mt-1" size={32} />
                <div>
                  <h2 className="text-2xl font-bold mb-3">Regulatory Compliance</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    NeuralEstate AI operates in compliance with applicable securities, financial services, and anti-money laundering regulations. We work closely with legal and regulatory experts to ensure our platform meets all required standards.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <CheckCircle2 className="text-green-400 mr-2" size={20} />
                    Securities Compliance
                  </h3>
                  <p className="text-sm text-foreground/70">
                    Tokenized real estate offerings comply with applicable securities laws. We conduct proper registration or rely on exemptions where available.
                  </p>
                </div>

                <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <CheckCircle2 className="text-green-400 mr-2" size={20} />
                    KYC/AML
                  </h3>
                  <p className="text-sm text-foreground/70">
                    Comprehensive Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures are implemented for all users before they can invest.
                  </p>
                </div>

                <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <CheckCircle2 className="text-green-400 mr-2" size={20} />
                    Tax Reporting
                  </h3>
                  <p className="text-sm text-foreground/70">
                    We provide necessary tax documentation and reporting to help investors comply with their tax obligations in their respective jurisdictions.
                  </p>
                </div>

                <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <CheckCircle2 className="text-green-400 mr-2" size={20} />
                    Data Protection
                  </h3>
                  <p className="text-sm text-foreground/70">
                    Compliance with GDPR, CCPA, and other data protection regulations to ensure user privacy and data security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Standards */}
          <Card className="bg-background/30 border-white/10">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <Lock className="text-neon-cyan mt-1" size={32} />
                <div>
                  <h2 className="text-2xl font-bold mb-3">Security Standards</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    We maintain the highest security standards to protect user funds, data, and platform integrity.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-white/20 rounded-lg">
                  <h3 className="font-semibold mb-2">Smart Contract Audits</h3>
                  <p className="text-sm text-foreground/70">
                    All smart contracts undergo comprehensive security audits by reputable third-party firms before deployment. Audit reports are made available to investors.
                  </p>
                </div>

                <div className="p-4 border border-white/20 rounded-lg">
                  <h3 className="font-semibold mb-2">Infrastructure Security</h3>
                  <p className="text-sm text-foreground/70">
                    Our platform infrastructure follows industry best practices including encryption, secure key management, regular security assessments, and penetration testing.
                  </p>
                </div>

                <div className="p-4 border border-white/20 rounded-lg">
                  <h3 className="font-semibold mb-2">Bug Bounty Program</h3>
                  <p className="text-sm text-foreground/70">
                    We maintain an active bug bounty program to encourage responsible disclosure of security vulnerabilities. Rewards are provided for valid security findings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Framework */}
          <Card className="bg-background/30 border-white/10">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <Globe className="text-neon-cyan mt-1" size={32} />
                <div>
                  <h2 className="text-2xl font-bold mb-3">Legal Framework</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Our legal structure ensures proper governance, investor protection, and regulatory compliance across jurisdictions.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Jurisdiction</h3>
                  <p className="text-sm text-foreground/70">
                    NeuralEstate AI operates under [Jurisdiction] law. All legal disputes are subject to the jurisdiction of [Court/Location].
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Investor Protection</h3>
                  <p className="text-sm text-foreground/70">
                    We maintain proper legal structures to protect investor rights, including clear ownership documentation, transparent governance, and dispute resolution mechanisms.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Regulatory Updates</h3>
                  <p className="text-sm text-foreground/70">
                    We continuously monitor regulatory developments and adapt our compliance framework to meet evolving requirements in the blockchain and real estate tokenization space.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Disclaimers */}
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="text-yellow-400 mt-1" size={32} />
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">Important Disclaimers</h2>
                  <div className="space-y-4 text-foreground/80">
                    <div>
                      <h3 className="font-semibold mb-2">Regulatory Status</h3>
                      <p className="text-sm">
                        The regulatory landscape for blockchain-based securities and tokenized assets is evolving. Regulations may change, and compliance requirements may vary by jurisdiction. Investors should consult with legal and financial advisors.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">No Legal Advice</h3>
                      <p className="text-sm">
                        Information provided on this page does not constitute legal, financial, or tax advice. You should consult with qualified professionals regarding your specific situation.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Jurisdictional Restrictions</h3>
                      <p className="text-sm">
                        Our services may not be available in all jurisdictions. Some countries have restrictions on cryptocurrency, tokenized securities, or blockchain-based investments. We reserve the right to restrict access based on jurisdiction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-background/30 border-white/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Compliance Inquiries</h2>
              <p className="text-foreground/70 mb-6">
                For questions about our compliance framework, regulatory status, or to report compliance concerns, please contact our compliance team.
              </p>
              <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg inline-block">
                <p className="font-semibold">Compliance Team</p>
                <p className="text-sm text-foreground/70">Email: compliance@neuralestate.ai</p>
                <p className="text-sm text-foreground/70">Legal: legal@neuralestate.ai</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

