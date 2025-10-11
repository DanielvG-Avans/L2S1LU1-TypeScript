import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // Base & root
    root: process.cwd(),
    base: env.VITE_BASE ?? "/",

    // Plugins: fast React, path aliases, SVG as React components, PWA, linting, image tooling, compression, legacy support
    plugins: [
      svgr(),
      react(),
      imagetools(),
      tailwindcss(),
      tsconfigPaths(),
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
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      viteCompression({
        algorithm: "gzip",
        ext: ".gz",
        deleteOriginFile: false,
      }),
      legacy({
        targets: ["defaults", "not IE 11"],
      }),
    ],

    // Resolve & aliases
    resolve: {
      alias: [
        { find: "@", replacement: "/src" },
        { find: "~", replacement: "/src" },
      ],
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },

    // Dev server optimized for local development
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

    // Build options tuned for modern apps + SSR support
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      target: "es2020",
      minify: mode === "production" ? "terser" : false,
      rollupOptions: {
        output: {
          // separate vendor chunk for better caching
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },

    // SSR configuration: ensure key libs are bundled for server render compatibility
    ssr: {
      // noExternal can help avoid ESM/CJS interop issues for some deps during SSR
      noExternal: [
        "react",
        "react-dom",
        // add other packages here that require bundling for SSR
      ],
    },

    // Dependency pre-bundling to improve dev start
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "prop-types"],
      esbuildOptions: {
        target: "es2020",
      },
    },

    // define globals available in app code via import.meta.env or replaced at build time
    define: {
      __DEV__: mode !== "production",
      __APP_ENV__: JSON.stringify(env.APP_ENV ?? mode),
    },

    // CSS: Vite will pick up Tailwind via postcss.config.js / tailwind.config.js automatically.
    css: {
      devSourcemap: true,
      postcss: {
        // leave blank — Vite will use user's postcss.config.js if present (recommended for Tailwind)
      },
    },

    // performance-friendly defaults, tweak as needed
    clearScreen: true,
  };
});
