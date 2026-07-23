import { useState, useRef, useCallback } from "react";
import { ArrowRight, Menu, X as CloseIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import ProductsMegaMenu from "./ProductsMegaMenu";
import PlatformMegaMenu from "./PlatformMegaMenu";
import SolutionsMegaMenu from "./SolutionsMegaMenu";
import ResourcesMegaMenu from "./ResourcesMegaMenu";

const navLinks = ["Home", "Platform", "Products", "Solutions", "Pricing", "Resources", "About"];

const mobileNavLinks = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

export default function LandingHeader() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      <header className="fixed top-0 z-50 left-2 right-2 sm:left-4 sm:right-4 bg-white border border-[#E2E4EF] rounded-full shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
            <img src={logo} alt="Zoiko One" className="h-7 sm:h-9 w-auto object-contain" />
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

          <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
            <a href="https://zoiko-one-platform-4wjm.vercel.app/" className="text-[#1E1B4B] no-underline">
              Sign In
            </a>
            <button onClick={() => navigate("/get-demo")} className="inline-flex items-center gap-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-5 py-2.5 shadow-md shadow-orange-200 transition-all duration-200">
              Get a Demo <ArrowRight size={15} />
            </button>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 text-[#1E1B4B]"
          >
            {mobileOpen ? <CloseIcon size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[#E2E4EF] bg-white px-4 pb-4 rounded-b-3xl">
            <nav className="flex flex-col gap-1 pt-2">
              {mobileNavLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm font-medium text-[#2A2F55] no-underline border-b border-gray-100 last:border-0"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-4">
              <a
                href="https://zoiko-one-platform-4wjm.vercel.app/"
                onClick={() => setMobileOpen(false)}
                className="text-center text-sm font-semibold text-[#1E1B4B] no-underline py-2"
              >
                Sign In
              </a>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/get-demo");
                }}
                className="inline-flex items-center justify-center gap-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-5 py-3 shadow-md shadow-orange-200 transition-colors font-semibold text-sm"
              >
                Get a Demo <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
