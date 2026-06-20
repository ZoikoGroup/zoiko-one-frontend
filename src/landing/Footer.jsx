import logo from "../assets/logo.png";

const columns = [
  { title: "PLATFORM", links: ["Overview", "How Zoiko One Works", "Security"] },
  { title: "PRODUCTS", links: ["Zoiko HR", "ZoikoTime", "Zoiko Payroll"] },
  { title: "SOLUTIONS", links: ["Small Business", "Agencies", "Professional Services"] },
];

export default function Footer() {
  return (
    <footer className="bg-[#161336] text-blue-200 py-16">
      <div className="px-4 sm:px-6 lg:px-20 grid md:grid-cols-4 gap-10">
        <div>
          <div className="mb-4">
            <img src={logo} alt="ZoikoOne" className="h-8 w-auto" />
          </div>
          <p className="text-sm text-blue-300 max-w-xs leading-relaxed">
            The end-to-end business operations platform. Run people, time, payroll, billing,
            projects, compliance, and insights in one connected layer.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-[#FB923C] text-xs font-bold tracking-[0.15em] mb-4">{col.title}</p>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}