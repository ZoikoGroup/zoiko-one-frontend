import { useState, useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import ProductsMegaMenu from "./ProductsMegaMenu";
import PlatformMegaMenu from "./PlatformMegaMenu";
import SolutionsMegaMenu from "./SolutionsMegaMenu";
import ResourcesMegaMenu from "./ResourcesMegaMenu";

const navLinks = ["Home", "Platform", "Products", "Solutions", "Pricing", "Resources", "About"];

export default function LandingHeader() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const closeTimer = useRef(null);

  const startClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  const openMenu = useCallback((menu) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(menu);
  }, []);

  return (
    <>
      <header className="fixed top-0 z-50 left-4 right-4 bg-white border border-[#E2E4EF] rounded-full shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
            <img src={logo} alt="Zoiko One" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2A2F55] overflow-visible">
            {navLinks.map((l) => {
              if (l === "Home") {
                return <Link key={l} to="/" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              if (l === "Platform") {
                return (
                  <div
                    key={l}
                    style={{ position: "relative" }}
                    onMouseEnter={() => openMenu("platform")}
                    onMouseLeave={startClose}
                  >
                    <button
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        color: activeMenu === "platform" ? "#4F46E5" : "#2A2F55",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px 2px",
                        userSelect: "none",
                        fontFamily: "inherit",
                      }}
                    >
                      Platform
                      <span
                        style={{
                          fontSize: 11,
                          transition: "transform 0.2s",
                          display: "inline-block",
                          transform: activeMenu === "platform" ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        &#8964;
                      </span>
                    </button>

                    {activeMenu === "platform" && (
                      <div
                        style={{
                          position: "fixed",
                          top: 64,
                          left: "50%",
                          transform: "translateX(-50%)",
                          zIndex: 200,
                        }}
                        onMouseEnter={cancelClose}
                        onMouseLeave={startClose}
                      >
                        <PlatformMegaMenu />
                      </div>
                    )}
                  </div>
                );
              }
              if (l === "Products") {
                return (
                  <div
                    key={l}
                    style={{ position: "relative" }}
                    onMouseEnter={() => openMenu("products")}
                    onMouseLeave={startClose}
                  >
                    <button
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        color: activeMenu === "products" ? "#4F46E5" : "#2A2F55",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px 2px",
                        userSelect: "none",
                        fontFamily: "inherit",
                      }}
                    >
                      Products
                      <span
                        style={{
                          fontSize: 11,
                          transition: "transform 0.2s",
                          display: "inline-block",
                          transform: activeMenu === "products" ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        &#8964;
                      </span>
                    </button>

                    {activeMenu === "products" && (
                      <div
                        style={{
                          position: "fixed",
                          top: 64,
                          left: "50%",
                          transform: "translateX(-50%)",
                          zIndex: 200,
                        }}
                        onMouseEnter={cancelClose}
                        onMouseLeave={startClose}
                      >
                        <ProductsMegaMenu />
                      </div>
                    )}
                  </div>
                );
              }
              if (l === "Solutions") {
                return (
                  <div
                    key={l}
                    style={{ position: "relative" }}
                    onMouseEnter={() => openMenu("solutions")}
                    onMouseLeave={startClose}
                  >
                    <button
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        color: activeMenu === "solutions" ? "#4F46E5" : "#2A2F55",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px 2px",
                        userSelect: "none",
                        fontFamily: "inherit",
                      }}
                    >
                      Solutions
                      <span
                        style={{
                          fontSize: 11,
                          transition: "transform 0.2s",
                          display: "inline-block",
                          transform: activeMenu === "solutions" ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        &#8964;
                      </span>
                    </button>

                    {activeMenu === "solutions" && (
                      <div
                        style={{
                          position: "fixed",
                          top: 64,
                          left: "50%",
                          transform: "translateX(-50%)",
                          zIndex: 200,
                        }}
                        onMouseEnter={cancelClose}
                        onMouseLeave={startClose}
                      >
                        <SolutionsMegaMenu />
                      </div>
                    )}
                  </div>
                );
              }
              if (l === "Pricing") {
                return <Link key={l} to="/pricing" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              if (l === "Resources") {
                return (
                  <div
                    key={l}
                    style={{ position: "relative" }}
                    onMouseEnter={() => openMenu("resources")}
                    onMouseLeave={startClose}
                  >
                    <button
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        color: activeMenu === "resources" ? "#4F46E5" : "#2A2F55",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px 2px",
                        userSelect: "none",
                        fontFamily: "inherit",
                      }}
                    >
                      Resources
                      <span
                        style={{
                          fontSize: 11,
                          transition: "transform 0.2s",
                          display: "inline-block",
                          transform: activeMenu === "resources" ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        &#8964;
                      </span>
                    </button>

                    {activeMenu === "resources" && (
                      <div
                        style={{
                          position: "fixed",
                          top: 64,
                          left: "50%",
                          transform: "translateX(-50%)",
                          zIndex: 200,
                        }}
                        onMouseEnter={cancelClose}
                        onMouseLeave={startClose}
                      >
                        <ResourcesMegaMenu />
                      </div>
                    )}
                  </div>
                );
              }
              if (l === "About") {
                return <Link key={l} to="/about" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              return null;
            })}
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link to="/login" className="text-[#1E1B4B] no-underline">
              Sign In
            </Link>
            <button onClick={() => navigate("/get-demo")} className="inline-flex items-center gap-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-5 py-2.5 shadow-md shadow-orange-200 transition-all duration-200">
              Get a Demo <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
