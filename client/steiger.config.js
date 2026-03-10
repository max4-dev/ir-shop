import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ["./src/entities/**", "./src/features/**", "./src/widgets/**", "./src/pages/**"],
    rules: {
      "fsd/public-api": "off",
    },
  },
  {
    files: [
      "./src/shared/lib/hooks/useAppDispatch.ts",
      "./src/shared/lib/hooks/useActions.ts",
      "./src/shared/lib/hooks/useTypedSelector.ts",
    ],
    rules: {
      "fsd/forbidden-imports": "off",
    },
  },
]);
