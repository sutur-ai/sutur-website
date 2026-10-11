export const SX_TEAMS = {
  ops: { label: 'Operations', asks: [
    { q: 'Every morning, tell me what is late and who owns it.', apps: ['Jira', 'Outlook'] },
    { q: 'Turn this meeting’s notes into tickets and assign them.', apps: ['Teams', 'Jira'] },
    { q: 'Follow up with every supplier who hasn’t confirmed delivery.', apps: ['Gmail', 'Odoo'] } ] },
  finance: { label: 'Finance', asks: [
    { q: 'Match last week’s payments to their invoices.', apps: ['Odoo', 'Excel'] },
    { q: 'Chase overdue invoices, politely, in each client’s language.', apps: ['QuickBooks', 'Outlook'] },
    { q: 'Send me our cash position every Friday at 5.', apps: ['Xero', 'Teams'] } ] },
  sales: { label: 'Sales', asks: [
    { q: 'Update the CRM from today’s emails and calls.', apps: ['Gmail', 'HubSpot'] },
    { q: 'Draft a follow-up for every demo we ran this week.', apps: ['Salesforce', 'Gmail'] },
    { q: 'Which deals went quiet this month, and why?', apps: ['HubSpot', 'Slack'] } ] },
  creative: { label: 'Creative', asks: [
    { q: 'Resize the campaign for every channel and file it.', apps: ['Photoshop', 'Drive'] },
    { q: 'Cut a 30-second version of yesterday’s interview.', apps: ['Premiere Pro', 'Dropbox'] },
    { q: 'Turn the brief into three mock-ups for review.', apps: ['Canva', 'Figma'] } ] },
  leaders: { label: 'Leadership', asks: [
    { q: 'Brief me before 8 on Monday: numbers, risks, decisions due.', apps: ['Outlook', 'Odoo'] },
    { q: 'Summarise what each team shipped this week.', apps: ['Jira', 'Slack'] },
    { q: 'Find every decision we made about pricing this year.', apps: ['Notion', 'Teams'] } ] }
} as const;
