import { dirname, join } from "path"

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, "package.json")))
}

export default {
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  stories: ["../**/*.mdx", "../**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  docs: {
    autodocs: "tag",
  },
}
