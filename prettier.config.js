import sortImports from "@trivago/prettier-plugin-sort-imports"

export default {
  semi: false,
  plugins: [sortImports],
  importOrderSeparation: true,
  importOrder: ["^#(.*)$", "^[./]"],
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ["typescript", "jsx"],
  overrides: [
    { files: "*.svg", options: { parser: "html" } },
    { files: "*.hbs", options: { parser: "html" } },
    { files: "*.ts", options: { importOrderParserPlugins: ["typescript"] } },
  ],
}
