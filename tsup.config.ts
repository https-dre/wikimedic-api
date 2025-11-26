import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  loader: {
    ".sql": "copy",
  },
});
