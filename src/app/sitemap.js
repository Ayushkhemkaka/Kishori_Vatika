const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5002";
function sitemap() {
  const now = /* @__PURE__ */ new Date();
  const routes = ["/", "/about", "/contact", "/offers", "/enquiry"];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7
  }));
}
export default sitemap;
