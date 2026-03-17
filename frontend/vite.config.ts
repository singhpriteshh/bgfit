import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load using Vite's loadEnv to get access to .env files or system env
  // The third argument '' means load all env vars, not just VITE_ prefixed ones if necessary,
  // but usually VITE_ ones are enough. Here we want VITE_PROXY_TARGET.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      allowedHosts: true,
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET || "http://localhost:8000",
          changeOrigin: true,
        },
      },
      host: true, // Needed for docker mapping
      fs: {
        // Deny access to sensitive files
        deny: [
          ".env",
          ".env.*",
          "Dockerfile",
          "nginx.conf",
          "*.log",
        ],
      },
    },
    // Exclude non-source files from being processed
    assetsInclude: [],
    build: {
      rollupOptions: {
        external: [/Dockerfile/, /nginx\.conf/],
      },
    },
  };
});
