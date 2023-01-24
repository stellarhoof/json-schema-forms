export default {
  stories: ["../**/*.mdx", "../**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // https://github.com/storybookjs/storybook/discussions/18821
  refs: {
    "@chakra-ui/react": {
      disable: true, // 👈 chakra stories disabled here
    },
  },
}
