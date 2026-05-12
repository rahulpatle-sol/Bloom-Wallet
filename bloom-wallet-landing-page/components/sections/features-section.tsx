"use client";

import { motion } from "framer-motion";

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const features = [
    {
      title: "Biometric Authentication",
      description: "Use your fingerprint or face to secure and access your wallet. No passwords. No seed phrases.",
      icon: "🔐"
    },
    {
      title: "Self-Custody",
      description: "Full control of your private keys without relying on centralized services or intermediaries.",
      icon: "👤"
    },
    {
      title: "Decentralized Recovery",
      description: "Recover your wallet without seed phrases using a distributed recovery network.",
      icon: "🔄"
    },
    {
      title: "Living Will",
      description: "Set up automatic asset inheritance for your loved ones after verification.",
      icon: "👨‍👧‍👦"
    },
    {
      title: "Cross-Platform",
      description: "Browser extension for desktop and native app for mobile devices.",
      icon: "📱"
    },
    {
      title: "Built on Solana",
      description: "Fast, secure, and efficient transactions on the Solana blockchain.",
      icon: "⚡"
    }
  ];

  return (
    <section id="features" className="relative w-full py-20 bg-background border-t border-border">
      <div className="w-full max-w-5xl px-6 sm:px-8 lg:px-12 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Why Bloom?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The most secure and user-friendly wallet designed for self-custody and peace of mind.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-8 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors space-y-4 group"
            >
              <div className="text-5xl group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-12 border-t border-border"
        >
          <p className="text-muted-foreground mb-6">
            Join the revolution in self-custody
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Download Now
            </a>
            <a
              href="#"
              className="px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg border border-border hover:bg-secondary/80 transition-colors"
            >
              View Docs
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
