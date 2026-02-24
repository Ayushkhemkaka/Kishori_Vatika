import { z } from "zod";

const analyticsTypeEnum = z.enum([
  "PAGE_VIEW",
  "OFFER_CLICK",
  "ENQUIRY_SUBMITTED",
]);

export const analyticsEventSchema = z.object({
  type: analyticsTypeEnum,
  sessionId: z
    .string()
    .min(1, "sessionId is required")
    .max(100, "sessionId too long"),
  offerId: z.string().cuid().optional(),
  path: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
