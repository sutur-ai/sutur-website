const rows = (values: string[][]) => values.map(cells => ({ cells }));

export const SX_SCEN = {
  finance: {
    chip: 'Chase overdue invoices', title: 'Overdue invoices', secs: 3,
    ask: 'Chase every invoice that is more than 30 days overdue.',
    tools: ['Searching invoices in Odoo', 'Reading email threads in Outlook', 'Drafting reminders'],
    a: 'I found ', b: '6 invoices', c: ' more than 30 days overdue, for a total of ', d: '18,400 USD', e: '.',
    head: ['Client', 'Invoice', 'Due', 'Amount'],
    rows: rows([['Cedar Foods', 'INV/2026/0398', '2 Sep', '4,200 USD'], ['Beit Mery Hotels', 'INV/2026/0412', '4 Sep', '2,800 USD'], ['Jounieh Marine', 'INV/2026/0441', '9 Sep', '3,650 USD']]),
    after: 'I drafted a reminder for each, in the tone of your last emails. Sending them waits for your yes.',
    approval: 'Send 6 payment reminders from your mailbox',
    doneLine: 'Approved · 6 reminders sent',
    done: 'Sent. I’ll watch for replies and flag anyone who hasn’t paid by Thursday.'
  },
  monday: {
    chip: 'Prep my Monday', title: 'Monday brief', secs: 3,
    ask: 'Get me ready for Monday.',
    tools: ['Reading your inbox in Outlook', 'Checking your calendar', 'Pulling your Jira issues'],
    a: 'You have ', b: '5 meetings', c: ' tomorrow and ', d: '4 issues', e: ' waiting on you. One clash:',
    head: ['Time', 'Meeting', 'Note'],
    rows: rows([['09:00', 'Team stand-up', 'Nothing to prepare'], ['11:30', 'Cedar Foods review', 'Bring the Q3 numbers'], ['16:00', 'Supplier call', 'Clashes with a client call']]),
    after: 'Lea is free on Tuesday at 11:00. I drafted a note to move the supplier call.',
    approval: 'Send Lea a note moving the call to Tuesday 11:00',
    doneLine: 'Approved · note sent to Lea',
    done: 'Done. Your brief is pinned, and I’ll write one every Monday at 7:30.'
  },
  design: {
    chip: 'Resize the campaign', title: 'Spring campaign', secs: 4,
    ask: 'Resize the spring campaign for Instagram, LinkedIn and the website.',
    tools: ['Opening spring-campaign.psd in Photoshop', 'Exporting 3 sizes', 'Saving to Google Drive'],
    a: '', b: '3 versions', c: ' are ready in ', d: 'Campaigns / Spring', e: '. The original is kept.',
    head: ['Channel', 'Size', 'File'],
    rows: rows([['Instagram', '1080 × 1080', 'spring-instagram.png'], ['LinkedIn', '1200 × 627', 'spring-linkedin.png'], ['Website', '1920 × 1080', 'spring-website.png']]),
    after: 'Shall I share the folder with the agency?',
    approval: 'Share Campaigns / Spring with the agency, view only',
    doneLine: 'Approved · folder shared',
    done: 'Shared. The agency can view the three files.'
  }
};
export const SX_OTHERS = ['Supplier price list', 'September VAT check', 'Quote for Beit Mery'];

export type HeroScenarioId = keyof typeof SX_SCEN;
