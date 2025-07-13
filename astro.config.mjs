// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://boydbloemsma.com",
  trailingSlash: "never",
  integrations: [react(), sitemap()],
  image: {
    service: passthroughImageService(),
    layout: "constrained",
  },
  markdown: {
    shikiConfig: {
      theme: "gruvbox-light-hard",
    },
  },
});
