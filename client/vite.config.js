import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import open from "open";

// ⚡ Ultra-optimized Vite config for large React apps (multi-tab ready)
export default defineConfig({
  plugins: [
    // 🔹 React + Fast Refresh
    react({
      jsxRuntime: "automatic",
      fastRefresh: true,
      babel: { compact: true },
      exclude: [/\.vite-cache/, /node_modules/],
    }),

    // 🔹 HMR diagnostic logger
    {
      name: "vite-dependency-diagnostics",
      handleHotUpdate({ file, server }) {
        const time = new Date().toLocaleTimeString();
        server.config.logger.info(
          `🩵 [${time}] HMR reload triggered by: ${file.replace(
            process.cwd(),
            ""
          )}`
        );
      },
    },

    // 🔹 Custom startup plugin — logs URL and opens 2 Chrome tabs
    {
      name: "vite-dev-startup",
      configureServer(server) {
        server.httpServer?.once("listening", async () => {
          const address = server.httpServer.address();
          const port =
            typeof address === "object" && address ? address.port : 5173;
          const url = `http://localhost:${port}`;

          console.log(`\n✅ Dev server running at: ${url}`);
          console.log(`💡 Tip: Working with multiple tabs is safe and optimized!\n`);

          try {
            // Open two Chrome tabs: one for normal user view, one for admin
            await open(url, { app: { name: "chrome" } });
            await open(url, { app: { name: "chrome" } });
          } catch (err) {
            console.error("⚠️ Could not auto-open Chrome tabs:", err.message);
          }
        });
      },
    },
  ],

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "zustand",
      "@mui/material",
      "@mui/icons-material",
    ],
    exclude: ["grapesjs"],
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: false, // we handle opening manually

    // 🧩 Reduce watcher load (keeps HMR smooth across multiple tabs)
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.git/**",
        "**/uploads/**",
        "**/public/**",
      ],
      usePolling: false,
    },

    // 🧠 HMR tuned for multiple tabs
    hmr: {
      overlay: false,
      timeout: 40000,
      clientPort: 5173,
      protocol: "ws",
    },
  },

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2500,
    minify: false,
  },

  logLevel: "warn",
  cacheDir: ".vite-cache",
  fs: { strict: false },
});
