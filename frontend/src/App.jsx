import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ZoikoProductsPage from "./pages/public/ZoikoProductsPage";
import PlatformPage from "./pages/responsive/PlatformPage";
import SolutionsPage from "./pages/public/SolutionsPage";
import PricingPage from "./pages/public/PricingPage";
import ContactPage from "./pages/public/ContactPage";
import ResourcesPage from "./pages/public/ResourcesPage";
import AboutPage from "./pages/public/AboutPage";
import ZoikoLeadershipPage from "./pages/public/ZoikoLeadershipPage";
import ZoikoCareersPage from "./pages/public/ZoikoCareersPage";
import ZoikoDemoPage from "./pages/public/ZoikoDemoPage";
import ZoikoHRPage from "./pages/products/ZoikoHRPage";
import ZoikoPayrollPage from "./pages/products/ZoikoPayrollPage";
import ZoikoTimePage from "./pages/products/ZoikoTimePage";
import ZoikoBillingPage from "./pages/products/ZoikoBillingPage";
import ZoikoProjectsPage from "./pages/products/ZoikoProjectsPage";
import ZoikoComplyPage from "./pages/products/ZoikoComplyPage";
import ZoikoSpendPage from "./pages/products/ZoikoSpendPage";
import ZoikoInventoryPage from "./pages/products/ZoikoInventoryPage";
import ZoikoDocsProPage from "./pages/products/ZoikoDocsProPage";
import ZoikoPeoplePage from "./pages/public/five-pillars/ZoikoPeoplePage";
import ZoikoMoneyPage from "./pages/public/five-pillars/ZoikoMoneyPage";
import ZoikoWorkPage from "./pages/public/five-pillars/ZoikoWorkPage";
import ZoikoSupplyPage from "./pages/public/five-pillars/ZoikoSupplyPage";
import ZoikoControlPage from "./pages/public/five-pillars/ZoikoControlPage";
import ZoikoHowItWorksPage from "./pages/platform/ZoikoHowItWorksPage";
import ZoikoSecurityPage from "./pages/platform/ZoikoSecurityPage";
import ZoikoTrustCenterPage from "./pages/platform/ZoikoTrustCenterPage";
import ZoikoConnectPage from "./pages/platform/ZoikoConnectPage";
import ZoikoApiDocsPage from "./pages/platform/ZoikoApiDocsPage";
import ZoikoSystemStatusPage from "./pages/platform/ZoikoSystemStatusPage";
import ZoikoEcosystemPage from "./pages/public/eco-system/ZoikoEcosystemPage";
import ZoikoVertexPage from "./pages/public/eco-system/ZoikoVertexPage";
import ZoikoSuitePage from "./pages/public/eco-system/ZoikoSuitePage";
import ZoikoSemaPage from "./pages/public/eco-system/ZoikoSemaPage";
import ZoikoLocalPage from "./pages/public/eco-system/ZoikoLocalPage";
import ZoikoDigitalPage from "./pages/public/eco-system/ZoikoDigitalPage";
import ZoikoInsightsPage from "./pages/public/ZoikoInsightsPage";
import ZoikoAgenciesPage from "./pages/public/ZoikoAgenciesPage";
import ZoikoRetailPage from "./pages/public/ZoikoRetailPage";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ZoikoProductsPage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/leadership" element={<ZoikoLeadershipPage />} />
      <Route path="/careers" element={<ZoikoCareersPage />} />
      <Route path="/five-pillars/people" element={<ZoikoPeoplePage />} />
      <Route path="/five-pillars/money" element={<ZoikoMoneyPage />} />
      <Route path="/five-pillars/work" element={<ZoikoWorkPage />} />
      <Route path="/five-pillars/supply" element={<ZoikoSupplyPage />} />
      <Route path="/five-pillars/control" element={<ZoikoControlPage />} />
      <Route path="/get-demo" element={<ZoikoDemoPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/products/zoiko-hr" element={<ZoikoHRPage />} />
      <Route path="/products/payroll" element={<ZoikoPayrollPage />} />
      <Route path="/products/zoikotime" element={<ZoikoTimePage />} />
      <Route path="/products/billing" element={<ZoikoBillingPage />} />
      <Route path="/products/comply" element={<ZoikoComplyPage />} />
      <Route path="/products/spend" element={<ZoikoSpendPage />} />
      <Route path="/projects" element={<ZoikoProjectsPage />} />
      <Route path="/inventory" element={<ZoikoInventoryPage />} />
      <Route path="/zoiko-docs" element={<ZoikoDocsProPage />} />
      <Route path="/how-it-works" element={<ZoikoHowItWorksPage />} />
      <Route path="/security" element={<ZoikoSecurityPage />} />
      <Route path="/trust-center" element={<ZoikoTrustCenterPage />} />
      <Route path="/integrations" element={<ZoikoConnectPage />} />
      <Route path="/api-documentation" element={<ZoikoApiDocsPage />} />
      <Route path="/system-status" element={<ZoikoSystemStatusPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/eco-system" element={<ZoikoEcosystemPage />} />
      <Route path="/vertex" element={<ZoikoVertexPage />} />
      <Route path="/suite" element={<ZoikoSuitePage />} />
      <Route path="/sema" element={<ZoikoSemaPage />} />
      <Route path="/local" element={<ZoikoLocalPage />} />
      <Route path="/digital" element={<ZoikoDigitalPage />} />
      <Route path="/insights" element={<ZoikoInsightsPage />} />
      <Route path="/solutions/agencies" element={<ZoikoAgenciesPage />} />
      <Route path="/solutions/retail" element={<ZoikoRetailPage />} />
      </Routes>
    </>
  );
}
