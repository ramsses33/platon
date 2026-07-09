import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import MarketSection from "@/components/market/MarketSection";
import StatsSection from "@/components/sections/StatsSection";
import TokenomicsRoadmap from "@/components/sections/TokenomicsRoadmap";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05070A] text-white overflow-hidden">
      <Navbar />
      <Hero />
      <MarketSection />
      <StatsSection />
      <TokenomicsRoadmap />
      <Footer />
    </main>
  );
}