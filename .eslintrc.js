module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
    globals: {
        document: true,
        localStorage: true,
        window: true,
    },
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module",
    },
    settings: {
        react: {version: "detect"},
    },
    rules: {
        "no-irregular-whitespace": 0, // 不规则的空格
        "no-useless-escape": "error", // 禁止不必要的转义使用
        "no-var": "error",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "react/prop-types": [2, {ignore: ["children"]}],
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "react/display-name": "off",
        "require-yield": "off",
    },
};
