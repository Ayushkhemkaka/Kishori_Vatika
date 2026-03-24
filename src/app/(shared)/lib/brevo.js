const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
  const customerFromEmail = process.env.BREVO_CUSTOMER_FROM_EMAIL?.trim() || fromEmail;
  const toEmail = process.env.BREVO_TO_EMAIL?.trim();
  const fromName = process.env.BREVO_FROM_NAME?.trim() || "KiSHORi VATiKA Website";

  if (!apiKey || !fromEmail || !toEmail) {
    return null;
  }

  return { apiKey, fromEmail, customerFromEmail, toEmail, fromName };
}

function formatField(label, value) {
  return `${label}: ${value || "Not provided"}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendBrevoEmail({ fromEmail, toEmail, toName, subject, text, html, replyTo }) {
  const config = getBrevoConfig();

  if (!config) {
    return {
      ok: false,
      skipped: true,
      reason: "Missing Brevo environment variables"
    };
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": config.apiKey,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        email: fromEmail || config.fromEmail,
        name: config.fromName
      },
      to: [
        {
          email: toEmail || config.toEmail,
          ...(toName ? { name: toName } : {})
        }
      ],
      subject,
      textContent: text,
      htmlContent: html,
      ...(replyTo ? { replyTo } : {})
    })
  });

  if (response.ok) {
    return { ok: true };
  }

  const errorText = await response.text();
  return {
    ok: false,
    skipped: false,
    reason: errorText || `Brevo request failed with status ${response.status}`
  };
}

async function sendEnquiryNotification(enquiry) {
  const subject = `New enquiry from ${enquiry.name}`;
  const text = [
    "A new enquiry was submitted on the website.",
    "",
    formatField("Name", enquiry.name),
    formatField("Email", enquiry.email),
    formatField("Phone", enquiry.phone),
    formatField("Check-in", enquiry.checkIn),
    formatField("Check-out", enquiry.checkOut),
    formatField("Guests", enquiry.guests),
    formatField("Offer ID", enquiry.offerId),
    formatField("Offer slug", enquiry.offerSlug),
    formatField("Source", enquiry.source),
    "",
    "Message:",
    enquiry.message || "No message provided"
  ].join("\n");

  const html = `
    <h2>New website enquiry</h2>
    <p>A new enquiry was submitted on the website.</p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(enquiry.name)}</li>
      <li><strong>Email:</strong> ${escapeHtml(enquiry.email)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(enquiry.phone || "Not provided")}</li>
      <li><strong>Check-in:</strong> ${escapeHtml(enquiry.checkIn)}</li>
      <li><strong>Check-out:</strong> ${escapeHtml(enquiry.checkOut)}</li>
      <li><strong>Guests:</strong> ${escapeHtml(enquiry.guests)}</li>
      <li><strong>Offer ID:</strong> ${escapeHtml(enquiry.offerId || "Not provided")}</li>
      <li><strong>Offer slug:</strong> ${escapeHtml(enquiry.offerSlug || "Not provided")}</li>
      <li><strong>Source:</strong> ${escapeHtml(enquiry.source || "Not provided")}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(enquiry.message || "No message provided").replaceAll("\n", "<br />")}</p>
  `;

  return sendBrevoEmail({
    subject,
    text,
    html,
    replyTo: {
      email: enquiry.email,
      name: enquiry.name
    }
  });
}

async function sendEnquiryAcknowledgement(enquiry) {
  const config = getBrevoConfig();
  const subject = "We received your enquiry - KiSHORi VATiKA";
  const offerLine = enquiry.offerSlug || enquiry.offerId
    ? `Preferred offer: ${enquiry.offerSlug || enquiry.offerId}`
    : "Preferred offer: General enquiry";
  const text = [
    `Dear ${enquiry.name},`,
    "",
    "Thank you for contacting KiSHORi VATiKA.",
    "We have received your enquiry and our team will get back to you with availability and pricing within 24 hours.",
    "",
    "Your enquiry details:",
    formatField("Check-in", enquiry.checkIn),
    formatField("Check-out", enquiry.checkOut),
    formatField("Guests", enquiry.guests),
    offerLine,
    "",
    "Your message:",
    enquiry.message || "No message provided",
    "",
    "If you need to add anything else, simply reply to this email.",
    "",
    "Warm regards,",
    "KiSHORi VATiKA"
  ].join("\n");

  const html = `
    <h2>Thank you for your enquiry</h2>
    <p>Dear ${escapeHtml(enquiry.name)},</p>
    <p>Thank you for contacting <strong>KiSHORi VATiKA</strong>.</p>
    <p>We have received your enquiry and our team will get back to you with availability and pricing within 24 hours.</p>
    <p><strong>Your enquiry details</strong></p>
    <ul>
      <li><strong>Check-in:</strong> ${escapeHtml(enquiry.checkIn)}</li>
      <li><strong>Check-out:</strong> ${escapeHtml(enquiry.checkOut)}</li>
      <li><strong>Guests:</strong> ${escapeHtml(enquiry.guests)}</li>
      <li><strong>Preferred offer:</strong> ${escapeHtml(enquiry.offerSlug || enquiry.offerId || "General enquiry")}</li>
    </ul>
    <p><strong>Your message</strong></p>
    <p>${escapeHtml(enquiry.message || "No message provided").replaceAll("\n", "<br />")}</p>
    <p>If you need to add anything else, simply reply to this email.</p>
    <p>Warm regards,<br />KiSHORi VATiKA</p>
  `;

  return sendBrevoEmail({
    fromEmail: config?.customerFromEmail,
    toEmail: enquiry.email,
    toName: enquiry.name,
    subject,
    text,
    html,
    replyTo: {
      email: config?.toEmail || enquiry.email,
      name: "KiSHORi VATiKA"
    }
  });
}

async function sendContactNotification(contact) {
  const subject = `New contact message from ${contact.name}`;
  const text = [
    "A new contact message was submitted on the website.",
    "",
    formatField("Name", contact.name),
    formatField("Email", contact.email),
    formatField("Phone", contact.phone),
    formatField("Source", contact.source),
    formatField("Path", contact.path),
    "",
    "Message:",
    contact.message || "No message provided"
  ].join("\n");

  const html = `
    <h2>New contact message</h2>
    <p>A new contact message was submitted on the website.</p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(contact.name)}</li>
      <li><strong>Email:</strong> ${escapeHtml(contact.email)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(contact.phone || "Not provided")}</li>
      <li><strong>Source:</strong> ${escapeHtml(contact.source || "Not provided")}</li>
      <li><strong>Path:</strong> ${escapeHtml(contact.path || "Not provided")}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(contact.message || "No message provided").replaceAll("\n", "<br />")}</p>
  `;

  return sendBrevoEmail({
    subject,
    text,
    html,
    replyTo: {
      email: contact.email,
      name: contact.name
    }
  });
}

export {
  sendContactNotification,
  sendEnquiryAcknowledgement,
  sendEnquiryNotification
};
