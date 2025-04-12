import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
       "@typescript-eslint/no-empty-object-type": "off",
       "react-hooks/rules-of-hooks": "off", // ❗️Ojo: puede causar bugs en runtime si se usa mal
       "react-hooks/exhaustive-deps": "off", // Desactiva warning de dependencias en useEffect
       "@next/next/no-img-element": "off", // Permite usar <img> en lugar de <Image />
    }
  }
];

export default eslintConfig;
