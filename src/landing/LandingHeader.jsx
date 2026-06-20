import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const navLinks = ["Home", "Platform", "Products", "Solutions", "Pricing", "Resources", "Company"];

export default function LandingHeader() {
  return (
    <div className="bg-gradient-to-b from-[#F1EEFC] to-white">
      <div className="px-4 sm:px-6 lg:px-20 pt-8">
        <nav className="flex items-center justify-between bg-white rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.06)] px-6 py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
            <img src={logo} alt="Zoiko One" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2A2F55]">
            {navLinks.map((l) => {
              if (l === "Home") {
                return <Link key={l} to="/" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              if (l === "Products") {
                return <Link key={l} to="/products" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              return (
                <a key={l} href={l === "Platform" ? "/platform" : l === "Pricing" ? "/#pricing" : "/"} className="hover:text-[#4F46E5] transition-colors">
                  {l}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link to="/login" className="text-[#1E1B4B] no-underline">
              Sign In
            </Link>
            <button className="inline-flex items-center gap-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-5 py-2.5 shadow-md shadow-orange-200 transition-all duration-200">
              Get a Demo <ArrowRight size={15} />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}