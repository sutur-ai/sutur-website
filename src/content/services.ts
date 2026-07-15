export const OPERATIONAL_ISSUES = [
  {
    id: "disconnected",
    title: "Disconnected tools",
    description:
      "Your CRM doesn't talk to accounting. Sales uses one spreadsheet; purchasing uses another. Data gets re-entered, delayed, and lost between silos.",
  },
  {
    id: "manual",
    title: "Manual, repetitive work",
    description:
      "Teams spend hours on data entry, report stitching, and cross-checking numbers that should flow automatically.",
  },
  {
    id: "visibility",
    title: "Limited visibility",
    description:
      "Without a single source of truth, leadership makes decisions based on incomplete or outdated information.",
  },
  {
    id: "underuse",
    title: "ERP underuse",
    description:
      "Many organizations own an ERP but use only a fraction of its capabilities — or worse, work around it because it was never properly configured.",
  },
  {
    id: "growth",
    title: "Scaling friction",
    description:
      "Processes that worked for five people break at fifty. Growth exposes gaps that spreadsheets and standalone apps cannot bridge.",
  },
] as const;

export const ERP_MODULES = [
  {
    id: "crm",
    label: "CRM",
    description:
      "Track leads, manage pipelines, and maintain customer relationships in one place.",
  },
  {
    id: "sales",
    label: "Sales",
    description:
      "Quotes, sales orders, and invoicing connected directly to inventory and accounting.",
  },
  {
    id: "purchase",
    label: "Purchase",
    description:
      "Procurement workflows, vendor management, and automated purchase orders.",
  },
  {
    id: "accounting",
    label: "Accounting",
    description:
      "Full double-entry ledger, accounts payable/receivable, bank reconciliation, and financial reporting.",
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    description:
      "Bills of materials, production routings, work orders, and quality control points.",
  },
  {
    id: "inventory",
    label: "Inventory",
    description:
      "Multi-warehouse stock management with real-time valuation and automated replenishment.",
  },
  {
    id: "custom",
    label: "Custom Development",
    description:
      "Tailored modules, reports, and integrations built to fit your exact workflows — not the other way around.",
  },
] as const;

export const AGENT_PATTERNS = [
  {
    id: "knowledge",
    title: "Internal knowledge agent",
    description:
      "Configured to answer questions using your documentation, ERP records, and approved company resources — with access governed by your existing permissions.",
    lead: true,
  },
  {
    id: "reporting",
    title: "Reporting assistant",
    description:
      "Generates and distributes scheduled reports, highlights anomalies, and surfaces trends from your live business data.",
    lead: false,
  },
  {
    id: "inventory",
    title: "Inventory alerts",
    description:
      "Monitors stock levels across warehouses and notifies the right people before shortages or overstock become problems.",
    lead: false,
  },
  {
    id: "accounting",
    title: "Accounting automation",
    description:
      "Assists with reconciliation, flags unusual transactions, and helps maintain audit-ready financial records.",
    lead: false,
  },
] as const;

export const operationalIssues = OPERATIONAL_ISSUES.map((item) => item.title);
export const otherModules = ["Inventory", "Point of sale", "Projects", "HR", "Ecommerce", "Field service"];
export const agentPatterns = AGENT_PATTERNS.map(({ title, description }) => ({ title, text: description }));
