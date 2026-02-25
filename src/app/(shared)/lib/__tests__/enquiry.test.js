import { describe, it, expect } from "vitest";
import { createEnquirySchema } from "../validation/enquiry";
describe("createEnquirySchema", () => {
  it("accepts valid enquiry payload", () => {
    const result = createEnquirySchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Looking for a quiet weekend.",
      checkIn: "2025-03-01",
      checkOut: "2025-03-03",
      guests: 2
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jane Doe");
      expect(result.data.source).toBe("website");
    }
  });
  it("rejects invalid email", () => {
    const result = createEnquirySchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      message: "Hi",
      checkIn: "2025-03-01",
      checkOut: "2025-03-03",
      guests: 1
    });
    expect(result.success).toBe(false);
  });
  it("rejects check-out before check-in", () => {
    const result = createEnquirySchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      message: "Hi",
      checkIn: "2025-03-05",
      checkOut: "2025-03-03",
      guests: 1
    });
    expect(result.success).toBe(false);
  });
  it("accepts optional offerId and phone", () => {
    const result = createEnquirySchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      phone: "+91 9876543210",
      message: "Hi",
      checkIn: "2025-03-01",
      checkOut: "2025-03-03",
      guests: 2,
      offerId: "clp1abc2d3e4f5g6h7i8j9k0"
    });
    expect(result.success).toBe(true);
  });
});
