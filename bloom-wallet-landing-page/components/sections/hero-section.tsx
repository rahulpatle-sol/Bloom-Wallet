"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center justify-center py-20 bg-background">
      <div className="relative z-10 w-full max-w-5xl px-6 sm:px-8 lg:px-12 mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 text-center"
        >
          {/* Logo Badge */}
          <motion.div variants={itemVariants} className="inline-flex justify-center mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/40 border border-secondary/60">
              <img src="/images/bloom-logo.png" alt="Bloom" className="w-5 h-5 object-contain" />
              <span className="text-sm font-medium text-secondary-foreground">Bloom Wallet</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight tracking-tight">
              The Last Wallet You&apos;ll Ever Need
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Biometric security meets self-custody. No seed phrases. No intermediaries. Just your assets, protected forever.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg border border-border hover:bg-secondary/80 transition-colors inline-flex items-center justify-center gap-2"
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Stats/Badge */}
          <motion.div variants={itemVariants} className="pt-4">
            <p className="text-sm text-muted-foreground">
              Trusted by developers • Built with free tools • Ready to customize
            </p>
          </motion.div>
        </motion.div>

        {/* Feature Grid Below Hero */}
        <motion.div
          variants={itemVariants}
          className="mt-24 pt-16 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              label: "No Seed Phrases",
              description: "Biometric authentication with full self-custody and recovery"
            },
            {
              label: "Decentralized Recovery",
              description: "Recover access without intermediaries or seed phrase backups"
            },
            {
              label: "Living Will",
              description: "Secure asset inheritance for your loved ones"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="text-center space-y-3"
            >
              <h3 className="text-lg font-semibold text-foreground">{item.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <svg className="w-6 h-6 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
