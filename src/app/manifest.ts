import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kishori Vatika",
    short_name: "Kishori Vatika",
    description:
      "Elegant boutique hotel with five room categories, dining, pool, and event spaces.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f8f2",
    theme_color: "#10b981",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
