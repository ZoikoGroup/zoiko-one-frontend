export const COMPLIANCE_COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
];

export const DEFAULT_COUNTRY = "IN";

const COUNTRY_META = {
  IN: { name: "India" },
  US: { name: "United States" },
  UK: { name: "United Kingdom" },
};

export function getCountryMeta(country) {
  return COUNTRY_META[country] || COUNTRY_META[DEFAULT_COUNTRY];
}

export function getFieldPack(country) {
  return [
    { label: "Company Legal Name", field: "name", type: "text" },
    { label: "Company Type", field: "type", type: "text" },
    { label: "Tax Registration No. (PAN/GST)", field: "taxNo", type: "text" },
    { label: "Employer ID", field: "employerId", type: "text" },
    { label: "Registered Address", field: "address", type: "text" },
    { label: "Industry", field: "industry", type: "text" },
    { label: "Jurisdiction — Country", field: "jurisdictionCountry", type: "text" },
    { label: "Jurisdiction — State", field: "jurisdictionState", type: "text" },
    { label: "Compliance Pack", field: "compliancePack", type: "text" },
  ];
}

const RATES_BY_COUNTRY = {
  IN: {
    rows: [
      { id: "pf", label: "Provident Fund", employee: "12%", employer: "12%", total: "24%" },
      { id: "esi", label: "ESI", employee: "0.75%", employer: "3.25%", total: "4%" },
      { id: "pt", label: "Professional Tax", employee: "₹200", employer: "—", total: "₹200" },
      { id: "gratuity", label: "Gratuity", employee: "—", employer: "4.81%", total: "4.81%" },
    ],
  },
  US: {
    rows: [
      { id: "social-security", label: "Social Security", employee: "6.2%", employer: "6.2%", total: "12.4%" },
      { id: "medicare", label: "Medicare", employee: "1.45%", employer: "1.45%", total: "2.9%" },
      { id: "federal-unemployment", label: "Federal Unemployment (FUTA)", employee: "—", employer: "6%", total: "6%" },
    ],
  },
  UK: {
    rows: [
      { id: "national-insurance", label: "National Insurance", employee: "12%", employer: "13.8%", total: "25.8%" },
      { id: "pension", label: "Workplace Pension", employee: "5%", employer: "3%", total: "8%" },
    ],
  },
};

export function getComplianceRates(country) {
  return RATES_BY_COUNTRY[country] || RATES_BY_COUNTRY[DEFAULT_COUNTRY];
}

const SLABS_BY_COUNTRY = {
  IN: {
    slabs: [
      { id: "in-1", min: "₹0", max: "₹3,00,000", rate: "Nil", tax: "No tax" },
      { id: "in-2", min: "₹3,00,001", max: "₹6,00,000", rate: "5%", tax: "5% of income over ₹3L" },
      { id: "in-3", min: "₹6,00,001", max: "₹9,00,000", rate: "10%", tax: "₹15,000 + 10% over ₹6L" },
      { id: "in-4", min: "₹9,00,001", max: "₹12,00,000", rate: "15%", tax: "₹45,000 + 15% over ₹9L" },
      { id: "in-5", min: "₹12,00,001", max: "₹15,00,000", rate: "20%", tax: "₹90,000 + 20% over ₹12L" },
      { id: "in-6", min: "₹15,00,001", max: "Above", rate: "30%", tax: "₹1,50,000 + 30% over ₹15L" },
    ],
  },
  US: {
    slabs: [
      { id: "us-1", min: "$0", max: "$11,000", rate: "10%", tax: "10% of income" },
      { id: "us-2", min: "$11,001", max: "$44,725", rate: "12%", tax: "$1,100 + 12% over $11,000" },
      { id: "us-3", min: "$44,726", max: "$95,375", rate: "22%", tax: "$5,147 + 22% over $44,725" },
      { id: "us-4", min: "$95,376", max: "$182,100", rate: "24%", tax: "$16,290 + 24% over $95,375" },
      { id: "us-5", min: "$182,101", max: "$231,250", rate: "32%", tax: "$37,104 + 32% over $182,100" },
      { id: "us-6", min: "$231,251", max: "$578,125", rate: "35%", tax: "$52,832 + 35% over $231,250" },
      { id: "us-7", min: "$578,126", max: "Above", rate: "37%", tax: "$174,238 + 37% over $578,125" },
    ],
  },
  UK: {
    slabs: [
      { id: "uk-1", min: "£0", max: "£12,570", rate: "0%", tax: "Personal allowance" },
      { id: "uk-2", min: "£12,571", max: "£50,270", rate: "20%", tax: "20% over £12,570" },
      { id: "uk-3", min: "£50,271", max: "£125,140", rate: "40%", tax: "£7,540 + 40% over £50,270" },
      { id: "uk-4", min: "£125,141", max: "Above", rate: "45%", tax: "£37,488 + 45% over £125,140" },
    ],
  },
};

export function getTaxSlabs(country) {
  return SLABS_BY_COUNTRY[country] || SLABS_BY_COUNTRY[DEFAULT_COUNTRY];
}
