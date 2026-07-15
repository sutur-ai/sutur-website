import type { BookingRequest } from "../schema";

/**
 * STUB — NOT OPERATIONAL
 *
 * This module will send acknowledgement and confirmation emails when:
 * 1. A sender domain and email provider are selected
 * 2. Credentials are configured (EMAIL_PROVIDER, EMAIL_FROM, etc.)
 * 3. The final booking recipient email is supplied
 *
 * Templates needed:
 * - Acknowledgement: sent immediately upon request receipt
 * - Confirmation: sent after manual approval, includes Google Meet link
 */

export interface EmailProvider {
  sendAcknowledgement(request: BookingRequest, requestId: string): Promise<void>;
  sendConfirmation(
    request: BookingRequest,
    meetingLink: string,
    confirmedTime: string
  ): Promise<void>;
}

export function createNoopEmailProvider(): EmailProvider {
  return {
    async sendAcknowledgement(_request: BookingRequest, _requestId: string): Promise<void> {
      // No-op in mock mode — no actual email is sent
    },

    async sendConfirmation(
      _request: BookingRequest,
      _meetingLink: string,
      _confirmedTime: string
    ): Promise<void> {
      // No-op in mock mode — no actual email is sent
    },
  };
}
