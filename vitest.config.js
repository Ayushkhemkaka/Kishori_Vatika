const { defineConfig } = require("vitest/config");
const path = require("path");

module.exports = defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.js", "src/**/*.test.jsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});