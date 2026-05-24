import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
  {
    files: ["./src/entities/**", "./src/features/**", "./src/widgets/**", "./src/pages/**"],
    rules: {
      "fsd/public-api": "off",
    },
  },
]);
