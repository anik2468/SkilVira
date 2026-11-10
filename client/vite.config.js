import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          groups: [
            {
              name: "livekit-react",
              test: /node_modules[\\/]@livekit[\\/]components-react[\\/]/,
              priority: 40,
              includeDependenciesRecursively: false,
            },
            {
              name: "livekit-core",
              test: /node_modules[\\/]@livekit[\\/]components-core[\\/]/,
              priority: 35,
              includeDependenciesRecursively: false,
            },
            {
              name: "livekit-client",
              test: /node_modules[\\/]livekit-client[\\/]/,
              priority: 30,
              includeDependenciesRecursively: false,
            },
            {
              name: "livekit-protocol",
              test: /node_modules[\\/]@livekit[\\/]protocol[\\/]/,
              priority: 25,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
});
