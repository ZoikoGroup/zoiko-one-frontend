import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import Hero from "../landing/Hero";
import WhatItIs from "../landing/WhatItIs";
import WhyExists from "../landing/WhyExists";
import ProductGrid from "../landing/ProductGrid";
import PricingTiers from "../landing/PricingTiers";
import GlobalReadiness from "../landing/GlobalReadiness";
import TrustCenter from "../landing/TrustCenter";
import BusinessCloud from "../landing/BusinessCloud";
import ComparisonTable from "../landing/ComparisonTable";
import WhoItsFor from "../landing/WhoItsFor";
import Philosophy from "../landing/Philosophy";
import FAQ from "../landing/FAQ";
import FinalCTA from "../landing/FinalCTA";

export default function HomePage() {
  return (
    <div className="font-sans bg-white text-[#111827] min-h-screen">
      <LandingHeader />
      <main>
        <Hero />
        <WhatItIs />
        <WhyExists />
        <ProductGrid />
        <PricingTiers />
        <GlobalReadiness />
        <TrustCenter />
        <BusinessCloud />
        <ComparisonTable />
        <WhoItsFor />
        <Philosophy />
        <FAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
