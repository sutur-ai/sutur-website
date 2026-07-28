# Connect the booking calendar

The booking section keeps the required lead form and Calendly calendar together on one page. Calendly's own final scheduling action reserves the selected slot and sends the booking notifications.

The live event is `https://calendly.com/elias-chaptini-sutur/30min`, hardcoded in `src/components/booking/Booking.tsx`. `NEXT_PUBLIC_CALENDLY_URL` still overrides it if you need to point a build at a different event.

## One-time Calendly setup

1. In Calendly, connect the Google or Microsoft calendar and email account that should receive bookings.
2. Create a 30-minute event type for the Sutur discovery call.
3. Keep Calendly's built-in name and email fields required.
4. Add these invitee questions in this exact order so the website can prefill them:
   1. Country — required, one line.
   2. City — required, one line.
   3. Phone number — required, one line.
   4. Business name — required, one line.
   5. Tell us more — optional, multiple lines.
5. Set availability, video-call details, reminders, and confirmation copy in Calendly.
6. The public event URL must look like `https://calendly.com/account/event-name`. To swap events, edit the constant in `Booking.tsx`, or override the build:

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

No API token is needed. The website validates first name, last name, country, city, phone number, email, and business name before unlocking the calendar. It then prefills Calendly's name, email, and custom answers. The visitor finishes inside Calendly; Calendly owns availability, reserves the chosen slot, writes the calendar event, creates meeting links, and sends host/invitee notifications according to the event settings.
