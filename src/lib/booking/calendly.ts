import type { BookingDetails } from '@/lib/booking/details';

const CALENDLY_HOSTS = new Set(['calendly.com', 'www.calendly.com']);

export function getCalendlyEmbedUrl(
  eventUrl?: string,
  details?: BookingDetails,
) {
  if (!eventUrl?.trim()) return null;

  try {
    const url = new URL(eventUrl.trim());
    const hasEventPath = url.pathname.split('/').filter(Boolean).length >= 2;

    if (
      url.protocol !== 'https:' ||
      !CALENDLY_HOSTS.has(url.hostname) ||
      !hasEventPath
    ) {
      return null;
    }

    url.searchParams.set('embed_type', 'Inline');
    url.searchParams.set('hide_gdpr_banner', '1');
    url.searchParams.set('background_color', 'fdfafc');
    url.searchParams.set('text_color', '3b1447');
    url.searchParams.set('primary_color', 'f57e20');

    if (details) {
      url.searchParams.set(
        'name',
        `${details.firstName.trim()} ${details.lastName.trim()}`,
      );
      url.searchParams.set('email', details.email.trim());
      url.searchParams.set('a1', details.location.trim());
      url.searchParams.set('a2', details.phone.trim());
      url.searchParams.set('a3', details.businessName.trim());
      if (details.tellUsMore.trim()) {
        url.searchParams.set('a4', details.tellUsMore.trim());
      }
    }

    return url.toString();
  } catch {
    return null;
  }
}
