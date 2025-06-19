import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8080,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
});