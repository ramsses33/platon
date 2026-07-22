import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import MarketSection from "@/components/market/MarketSection";
import EcosystemSection from "@/components/sections/EcosystemSection";
import LiveNetworkTicker from "@/components/sections/LiveNetworkTicker";
import StatsSection from "@/components/sections/StatsSection";
import TokenomicsRoadmap from "@/components/sections/TokenomicsRoadmap";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />
      <Hero />
      <LiveNetworkTicker />
      <EcosystemSection />
      <MarketSection />
      <StatsSection />
      <TokenomicsRoadmap />
      <Footer />
    </main>
  );
}