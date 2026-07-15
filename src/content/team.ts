export const TEAM_MEMBERS = [
  {
    id: "founder-1",
    namePlaceholder: "[Founder name]",
    rolePlaceholder: "[Role]",
    bioPlaceholder: "[Short approved bio — add after review]",
    photoUrl: null,
    linkedinUrl: null,
  },
  {
    id: "founder-2",
    namePlaceholder: "[Founder name]",
    rolePlaceholder: "[Role]",
    bioPlaceholder: "[Short approved bio — add after review]",
    photoUrl: null,
    linkedinUrl: null,
  },
] as const;

export type TeamMember = (typeof TEAM_MEMBERS)[number];
export const team = TEAM_MEMBERS.map((member) => ({ name: member.namePlaceholder, role: member.rolePlaceholder, bio: member.bioPlaceholder }));
