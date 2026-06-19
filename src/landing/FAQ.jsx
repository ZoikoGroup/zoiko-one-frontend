import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "What is Zoiko One?",
    a: "Zoiko One is a connected business operations platform that brings together people, time, payroll, billing, projects, compliance, spend and insights into one modular system. You can buy individual products, combine them in bundles, or adopt the full enterprise framework.",
  },
  {
    q: "What are the seven main products?",
    a: "Zoiko One includes Zoiko HR, ZoikoTime, Zoiko Payroll, Zoiko Billing, Zoiko Projects, Zoiko Comply, Zoiko Insights, and Zoiko Spend. Each product can be purchased standalone or combined with others.",
  },
  {
    q: "Can I buy only one product?",
    a: "Yes. Every Zoiko One product can be purchased and used independently. There is no requirement to buy multiple products. You can add more products when your operational needs grow.",
  },
  {
    q: "Is Zoiko Projects a main Zoiko One product?",
    a: "Yes, Zoiko Projects is one of the eight core products in the Zoiko One platform. It provides project planning, task tracking, timesheets, budgets and team collaboration capabilities.",
  },
  {
    q: "Is Zoiko One global?",
    a: "Yes. Zoiko One is built with a jurisdiction-agnostic architecture that supports multi-country, multi-currency, multi-entity and multi-regulatory environments. Every product is designed for global operations from day one.",
  },
  {
    q: "What is the Trust Center?",
    a: "The Trust Center is a publicly accessible resource that documents Zoiko One's security, privacy, compliance and governance materials. It is published before advertising campaigns begin, ensuring every claim is substantiated and visible without a sales conversation.",
  },
  {
    q: "How do ZoikoPay and ZoikoCoreX relate to Zoiko One?",
    a: "ZoikoPay and ZoikoCoreX are infrastructure layers that operate beneath Zoiko One. ZoikoPay handles payment settlement, disbursement and FX, while ZoikoCoreX maintains the financial truth layer. They power the financial capabilities within Zoiko One products.",
  },
  {
    q: "Are Sema, Local, Vertex and Web Services part of Zoiko One?",
    a: "No. Zoiko Sema, Zoiko Local, ZoikoVertex and Zoiko Web Services are adjacent standalone platforms within the Zoiko Business Cloud ecosystem. They integrate with Zoiko One but are separate products focused on communication, global reach, growth and digitization.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-[#7C3AED] tracking-[0.15em] uppercase mb-4">
            Questions buyers ask before they trust Zoiko One
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight">
            Frequently asked questions.
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors duration-200 hover:bg-gray-50"
              >
                <span className="text-sm font-semibold text-[#111827]">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#F97316] shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 pb-5 text-sm text-[#6B7280] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap mt-10">
          <button className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg shadow-orange-200 transition-all duration-200 hover:scale-[1.03]">
            Get a Demo <ArrowRight size={16} />
          </button>
          <button className="inline-flex items-center gap-2 bg-white text-[#374151] font-semibold px-7 py-3.5 rounded-full text-sm border-2 border-gray-200 hover:border-[#F97316] hover:text-[#F97316] transition-all duration-200">
            Visit Trust Center <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
