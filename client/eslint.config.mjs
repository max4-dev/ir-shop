import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import typescriptEs from "@typescript-eslint/parser";
import importEs from "eslint-plugin-import";
import reactRefresh from "eslint-plugin-react-refresh";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: true,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ),
  {
    ignores: ["dist", ".eslintrc.cjs"],
    languageOptions: {
      parser: typescriptEs,
    },
    plugins: {
      "react-refresh": reactRefresh,
      import: importEs,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: true,
        typescript: {
          project: ".",
        },
      },
    },
    rules: {
      "import/no-extraneous-dependencies": ["off"],
      "import/no-unresolved": "error",
      "import/prefer-default-export": "off",
      "no-param-reassign": "warn",
      "no-console": "warn",
      "prefer-promise-reject-errors": "warn",
      "import/extensions": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "no-shadow": ["off"],
      "arrow-body-style": ["off"],
    },
  },
];

export default eslintConfig;
