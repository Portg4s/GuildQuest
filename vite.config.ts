import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const base = mode === "pages" ? "/GuildQuest/" : "/";

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "pwa.svg", "icons/guildquest-icon.svg"],
        manifest: {
          name: "GuildQuest",
          short_name: "GuildQuest",
          description: "PWA offline-first d'apprentissage gamifiee avec quetes, quiz, gacha et duel.",
          theme_color: "#ef4444",
          background_color: "#050816",
          display: "standalone",
          orientation: "portrait",
          start_url: base,
          scope: base,
          icons: [
            {
              src: "icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "icons/maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            },
            {
              src: "pwa.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable"
            },
            {
              src: "icons/guildquest-icon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable"
            }
          ]
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,ico,png,webp,json}"]
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  };
});
