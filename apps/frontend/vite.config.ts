import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { imagetools } from "vite-imagetools";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isProd = mode === "production";

  return {
    root: process.cwd(),
    base: env.VITE_BASE ?? "/",

    plugins: [
      tailwindcss(),
      svgr(),
      react(),
      imagetools(),
      tsconfigPaths(),

      // PWA (registers service worker & manifest)
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
        manifest: {
          name: env.VITE_APP_NAME ?? "Vite React App",
          short_name: env.VITE_APP_SHORT_NAME ?? "ViteApp",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#1f2937",
          icons: [
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          ],
        },
      }),

      // Compression: gzip + brotli for production builds
      viteCompression({
        algorithm: "gzip",
        ext: ".gz",
        deleteOriginFile: false,
      }),
      viteCompression({
        algorithm: "brotliCompress",
        ext: ".br",
        deleteOriginFile: false,
      }),
    ],

    resolve: {
      // Let tsconfigPaths handle aliases; keep common extensions for editor ergonomics
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },

    server: {
      port: Number(env.VITE_PORT) || 3000,
      strictPort: true,
      open: true,
      fs: {
        // allow serving files from one level up to support monorepos if needed
        allow: [".."],
      },
      hmr: {
        protocol: "ws",
      },
    },

    preview: {
      port: Number(env.VITE_PREVIEW_PORT) || 3000,
      strictPort: true,
    },

    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: !isProd,
      target: "es2020",
      minify: isProd ? "terser" : false,
      terserOptions: isProd
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            format: {
              comments: false,
            },
          }
        : undefined,
      rollupOptions: {
        output: {
          // smarter vendor splitting: create vendor chunk for node_modules
          manualChunks(id) {
            // Only process node_modules
            if (!id.includes("node_modules")) return;

            // React and React-DOM must be together
            if (id.includes("/react/") || id.includes("/react-dom/")) {
              return "vendor-react";
            }

            // UI libraries
            if (id.includes("/lucide-react/") || id.includes("/some-ui-lib/")) {
              return "vendor-ui";
            }

            // Prop-types
            if (id.includes("/prop-types/")) {
              return "vendor-prop-types";
            }

            // Everything else from node_modules goes to vendor
            return "vendor";
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },

    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "prop-types"],
      esbuildOptions: {
        target: "es2020",
      },
    },

    define: {
      __DEV__: !isProd,
      __APP_ENV__: JSON.stringify(env.APP_ENV ?? mode),
    },

    css: {
      devSourcemap: true,
      postcss: {},
    },

    clearScreen: true,
  };
});
