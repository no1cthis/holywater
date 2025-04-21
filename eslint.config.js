import { typescript } from "@zemd/eslint-rock-stack";

export default [
  ...typescript(),
  {
    rules: {
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
    }
  }

];