import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { FooterSection } from "@/components/sections/footer-section";

export const metadata = {
  title: "Bloom Wallet - The Last Wallet You'll Ever Need",
  description: "Biometric security, decentralized recovery, and living will inheritance on Solana. No seed phrases. No intermediaries.",
  openGraph: {
    title: "Bloom Wallet",
    description: "The last wallet you'll ever need.",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <FooterSection />
    </main>
  );
}
