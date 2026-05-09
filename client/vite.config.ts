import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), nodePolyfills()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force isomorphic-git to use its ESM build instead of the CJS entry,
      // which `require`s Node's `crypto` module and breaks in Vite.
      "isomorphic-git": path.resolve(
        __dirname,
        "./node_modules/isomorphic-git/index.js"
      ),
    },
  },
  optimizeDeps: {
    include: ["isomorphic-git", "@isomorphic-git/lightning-fs"],
  },
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
})
