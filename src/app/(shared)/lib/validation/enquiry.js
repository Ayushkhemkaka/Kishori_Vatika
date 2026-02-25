import { z } from "zod";
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").refine(
  (s) => {
    const d = new Date(s);
    return !Number.isNaN(d.getTime());
  },
  { message: "Invalid date" }
);
const createEnquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be at most 200 characters").trim(),
  email: z.string().email("Invalid email address").max(320, "Email too long"),
  phone: z.string().max(30, "Phone must be at most 30 characters").optional().transform((v) => v?.trim() || void 0),
  message: z.string().min(1, "Message is required").max(5e3, "Message must be at most 5000 characters").trim(),
  checkIn: dateString,
  checkOut: dateString,
  guests: z.number().int("Guests must be a whole number").min(1, "At least 1 guest").max(50, "Maximum 50 guests"),
  source: z.string().max(50).optional().default("website"),
  offerId: z.string().cuid().optional(),
  offerSlug: z.string().max(100).optional()
}).refine(
  (data) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  },
  { message: "Check-out must be after check-in", path: ["checkOut"] }
);
export { createEnquirySchema };
