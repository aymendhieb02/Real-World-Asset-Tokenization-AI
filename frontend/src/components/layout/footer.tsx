import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 glass mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-4">
              NeuralEstate
            </div>
            <p className="text-sm text-foreground/60">
              AI-powered Real-World Asset tokenization platform. Invest in real estate with blockchain security.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><Link href="/properties" className="hover:text-neon-cyan transition-colors">Properties</Link></li>
              <li><Link href="/marketplace" className="hover:text-neon-cyan transition-colors">Marketplace</Link></li>
              <li><Link href="/portfolio" className="hover:text-neon-cyan transition-colors">Portfolio</Link></li>
              <li><Link href="/ai/insights" className="hover:text-neon-cyan transition-colors">AI Insights</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><Link href="/education" className="hover:text-neon-cyan transition-colors">Learn</Link></li>
              <li><Link href="/docs" className="hover:text-neon-cyan transition-colors">Documentation</Link></li>
              <li><Link href="/faq" className="hover:text-neon-cyan transition-colors">FAQ</Link></li>
              <li><Link href="/support" className="hover:text-neon-cyan transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><Link href="/terms" className="hover:text-neon-cyan transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-neon-cyan transition-colors">Privacy</Link></li>
              <li><Link href="/compliance" className="hover:text-neon-cyan transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} NeuralEstate AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

