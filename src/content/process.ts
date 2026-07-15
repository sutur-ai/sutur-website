export const ENGAGEMENT_STAGES = [
  {
    step: 1,
    title: "Discovery discussion",
    description:
      "We learn about your operations, pain points, and what you need your system to do. No pitch, no commitment — just a focused conversation.",
  },
  {
    step: 2,
    title: "Simple demo",
    description:
      "We show a practical Odoo example tailored to your industry so you can see how the system works with real scenarios.",
  },
  {
    step: 3,
    title: "Scoped definition",
    description:
      "Together we define the modules, customizations, and timeline that make sense for your organization — nothing more, nothing less.",
  },
  {
    step: 4,
    title: "Implementation",
    description:
      "We configure, develop, and integrate the system while keeping your team informed at every stage.",
  },
  {
    step: 5,
    title: "Point-of-contact training",
    description:
      "We train a designated person on your team so they can support day-to-day use and become your internal champion.",
  },
  {
    step: 6,
    title: "Launch when ready",
    description:
      "We go live only after testing confirms everything works. No rushed cutovers — your business continuity comes first.",
  },
  {
    step: 7,
    title: "Close follow-up",
    description:
      "We stay closely involved for approximately one year, then transition to less hands-on support once your team is confident and self-sufficient.",
  },
] as const;

export const processSteps = ENGAGEMENT_STAGES.map(({ title, description }) => [title, description] as const);
