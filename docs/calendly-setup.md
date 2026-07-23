# Connect the booking calendar

The booking section now keeps the required lead form and Calendly calendar together on one page. Until a Calendly event URL is configured, a valid form opens a prepared email instead of showing a broken scheduler.

## One-time Calendly setup

1. In Calendly, connect the Google or Microsoft calendar and email account that should receive bookings.
2. Create a 30-minute event type for the Sutur discovery call.
3. Keep Calendly's built-in name and email fields required.
4. Add these invitee questions in this exact order so the website can prefill them:
   1. Location — required, one line.
   2. Phone number — required, one line.
   3. Business name — required, one line.
   4. Tell us more — optional, multiple lines.
5. Set availability, video-call details, reminders, and confirmation copy in Calendly.
6. Copy the public event URL. It must look like `https://calendly.com/account/event-name`.
7. Add it to the GitHub repository and redeploy:

```bash
gh variable set NEXT_PUBLIC_CALENDLY_URL --body "https://calendly.com/account/event-name"
gh workflow run deploy.yml
```

## Local verification

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_CALENDLY_URL in .env.local
npm run dev
```

No API token is needed. The website validates first name, last name, location, phone number, work email, and business name before unlocking the calendar. It then prefills Calendly's name, email, and custom answers; Calendly owns availability, calendar writes, meeting links, and confirmation emails.
