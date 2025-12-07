"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  MessageSquare, 
  Book, 
  HelpCircle, 
  Send,
  CheckCircle2,
  AlertCircle,
  Github,
  Twitter,
  MessageCircle
} from "lucide-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", category: "general", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@neuralestate.ai",
      action: "mailto:support@neuralestate.ai"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 24/7",
      action: "#",
      comingSoon: true
    },
    {
      icon: MessageCircle,
      title: "Discord Community",
      description: "Join our community",
      contact: "discord.gg/neuralestate",
      action: "https://discord.gg/neuralestate"
    }
  ];

  const resources = [
    {
      icon: Book,
      title: "Documentation",
      description: "Comprehensive guides and API docs",
      link: "/docs"
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Answers to common questions",
      link: "/faq"
    },
    {
      icon: Github,
      title: "GitHub",
      description: "Open source code and issues",
      link: "https://github.com/neuralestate"
    },
    {
      icon: Twitter,
      title: "Twitter",
      description: "Latest updates and announcements",
      link: "https://twitter.com/neuralestate"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            We're here to help you with any questions about blockchain real estate tokenization, 
            investments, or our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-background/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="text-neon-cyan" size={24} />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Your name"
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="your@email.com"
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="investment">Investment Questions</option>
                      <option value="blockchain">Blockchain/Wallet Issues</option>
                      <option value="kyc">KYC/Verification</option>
                      <option value="billing">Billing/Payments</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      placeholder="Brief description of your issue"
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder="Please provide as much detail as possible..."
                      className="bg-background/50"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="flex items-center space-x-2 text-green-400 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                      <CheckCircle2 size={20} />
                      <span>Message sent successfully! We'll get back to you within 24 hours.</span>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="flex items-center space-x-2 text-red-400 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                      <AlertCircle size={20} />
                      <span>Failed to send message. Please try again or contact us directly.</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Support Channels & Resources */}
          <div className="space-y-6">
            {/* Support Channels */}
            <Card className="bg-background/30 border-white/10">
              <CardHeader>
                <CardTitle>Contact Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportChannels.map((channel, index) => (
                  <a
                    key={index}
                    href={channel.action}
                    className={`block p-4 rounded-lg border transition-all ${
                      channel.comingSoon
                        ? "border-white/10 opacity-60 cursor-not-allowed"
                        : "border-white/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <channel.icon className="text-neon-cyan mt-1" size={20} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{channel.title}</h3>
                          {channel.comingSoon && (
                            <span className="text-xs text-foreground/50">Coming Soon</span>
                          )}
                        </div>
                        <p className="text-sm text-foreground/60 mt-1">{channel.description}</p>
                        <p className="text-sm text-neon-cyan mt-2">{channel.contact}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-background/30 border-white/10">
              <CardHeader>
                <CardTitle>Helpful Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-white/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all"
                  >
                    <resource.icon className="text-neon-cyan mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-sm">{resource.title}</h3>
                      <p className="text-xs text-foreground/60 mt-1">{resource.description}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="bg-gradient-to-br from-midnight-navy to-deep-indigo border-neon-cyan/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-neon-cyan mb-2">&lt; 24h</div>
                <p className="text-sm text-foreground/70">
                  Average response time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

