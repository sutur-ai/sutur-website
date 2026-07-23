# Connect the booking calendar

The website is ready for a Calendly event URL. Until it is configured, the booking section shows a direct email link instead of a broken calendar.

1. In Calendly, connect the Google or Microsoft calendar and email account that should receive bookings.
2. Create a 30-minute event type for the Sutur discovery call.
3. Keep Calendly's required name and email fields. Add these invitee questions:
   - Company — required, one line.
   - What would you like to improve? — optional, multiple lines.
4. Set availability, location or video-call details, reminders, and confirmation copy in Calendly.
5. Copy the public event URL. It must look like `https://calendly.com/account/event-name`.
6. Add it to the GitHub repository and redeploy:

```bash
cd /home/alex/Desktop/sutur/website
gh variable set NEXT_PUBLIC_CALENDLY_URL --body "https://calendly.com/account/event-name"
gh workflow run deploy.yml
```

For local verification:

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_CALENDLY_URL in .env.local
npm run dev
```

No API token is needed. Calendly owns availability, intake fields, calendar writes, meeting links, and confirmation emails; the website only embeds the public event securely.
