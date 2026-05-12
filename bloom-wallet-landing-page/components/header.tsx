"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"}`}
    >
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-12 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="#hero" className="flex items-center gap-2 text-lg font-semibold tracking-tight transition-colors duration-300 text-foreground hover:text-primary">
          <img src="/images/bloom-logo.png" alt="Bloom" className="w-5 h-5 object-contain" />
          <span>Bloom</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm transition-colors text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#product"
            className="text-sm transition-colors text-muted-foreground hover:text-foreground"
          >
            How It Works
          </Link>
          <Link
            href="#security"
            className="text-sm transition-colors text-muted-foreground hover:text-foreground"
          >
            Security
          </Link>
          <Link
            href="#"
            className="text-sm transition-colors text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="#"
            className="px-6 py-2 text-sm font-medium transition-colors rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="transition-colors md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-lg px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="#features"
              className="text-base text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#product"
              className="text-base text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#security"
              className="text-base text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Security
            </Link>
            <Link
              href="#"
              className="text-base text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Docs
            </Link>
            <a
              href="#"
              className="mt-2 bg-primary text-primary-foreground px-6 py-2 text-center text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
