export const SITE_CONFIG = {
  companyName: "Sutur",
  heroHeadline: "Bring your whole business into one clear operating system.",
  heroSupporting:
    "Sutur designs and implements tailored Odoo ERP systems that connect your finance, sales, operations, and teams.",
  ctaLabel: "Book a free discovery call",
  ctaHref: "#book",

  navigation: [
    { label: "Solutions", href: "#solutions" },
    { label: "Agents", href: "#agents" },
    { label: "Process", href: "#process" },
    { label: "Team", href: "#team" },
    { label: "Book a Call", href: "#book" },
  ],

  contact: {
    email: "hello@sutur.co",
  },

  odooPartnerAsset: "/brand/odoo-partner-placeholder.svg",

  metadata: {
    title: "Sutur | One clear operating system for your business",
    description:
      "Tailored Odoo ERP implementation, custom development, and practical AI agents for growing operations.",
  },
} as const;
