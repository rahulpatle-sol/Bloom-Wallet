"use client";

import Link from "next/link";
import { Github, Twitter, ExternalLink } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Chrome Extension", href: "#" },
    { label: "Mobile App", href: "#" },
    { label: "Roadmap", href: "#" },
    { label: "Status", href: "#" },
  ],
  resources: [
    { label: "Docs", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Security", href: "#" },
    { label: "Privacy", href: "#" },
  ],
  community: [
    { label: "Discord", href: "#" },
    { label: "GitHub", href: "https://github.com/rahulpatle-sol/Bloom-Wallet" },
    { label: "Forum", href: "#" },
  ],
};

export function FooterSection() {
  return (
    <footer className="border-t border-border bg-background">
      {/* Main Footer Content */}
      <div className="w-full max-w-5xl px-6 sm:px-8 lg:px-12 mx-auto py-16 md:py-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="#hero" className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors">
              <img src="/images/bloom-logo.png" alt="Bloom" className="w-5 h-5 object-contain" />
              <span>Bloom</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The last wallet you&apos;ll ever need. Secure, self-custodial, and built for the future.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Community</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border w-full max-w-5xl px-6 sm:px-8 lg:px-12 mx-auto py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 Bloom Wallet. Built with free tools for everyone.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/rahulpatle-sol/Bloom-Wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            title="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            title="Twitter"
          >
            <Twitter size={16} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            title="External"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
