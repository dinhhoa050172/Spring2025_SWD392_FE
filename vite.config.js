import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import process from "node:process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => {
  // Load biến môi trường từ .env
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@pages": path.resolve(__dirname, "./src/page"),
        "@containers": path.resolve(__dirname, "./src/container"),
        "@layouts": path.resolve(__dirname, "./src/layout"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@src": path.resolve(__dirname, "./src"),
      },
    },
    base: env.VITE_BASE_PATH || "/",
  };
});
