import LandingHeader from "../../components/layout/LandingHeader";
import Hero from "../../components/sections/Hero";
import WhatItIs from "../../components/sections/WhatItIs";
import WhyExists from "../../components/sections/WhyExists";
import ProductGrid from "../../components/sections/ProductGrid";
import WhoItsFor from "../../components/sections/WhoItsFor";
import Philosophy from "../../components/sections/Philosophy";
import TrustCenter from "../../components/sections/TrustCenter";
import BusinessCloud from "../../components/sections/BusinessCloud";
import PricingTiers from "../../components/sections/PricingTiers";
import ComparisonTable from "../../components/sections/ComparisonTable";
import FAQ from "../../components/sections/FAQ";
import FinalCTA from "../../components/sections/FinalCTA";
import Footer from "../../components/layout/Footer";

export default function HomePage() {
  return (
    <div className="font-sans bg-white text-[#111827] min-h-screen">
      <LandingHeader />
      <main>
        <Hero />
        <WhatItIs />
        <WhyExists />
        <ProductGrid />
        <WhoItsFor />
        <Philosophy />
        <TrustCenter />
        <BusinessCloud />
        <PricingTiers />
        <ComparisonTable />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}