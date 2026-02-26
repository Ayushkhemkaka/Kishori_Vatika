const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5002";
function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
export default robots;
