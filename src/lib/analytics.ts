/**
 * Shared analytics constants and types.
 * Session cookie is set by middleware; client and API read it for event correlation.
 */

export const ANALYTICS_SESSION_COOKIE = "kv_session_id";

export type AnalyticsEventType = "PAGE_VIEW" | "OFFER_CLICK" | "ENQUIRY_SUBMITTED";

export interface AnalyticsEventPayload {
  type: AnalyticsEventType;
  offerId?: string;
  path?: string;
  metadata?: Record<string, unknown>;
}
