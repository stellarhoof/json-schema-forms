import * as React from "react"
import prettier from "prettier/standalone.js"
import parser from "prettier/parser-typescript.js"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { Preview } from "@storybook/react"
import { Title, Subtitle, Description, Stories } from "@storybook/blocks"
import { FormComponentsProvider } from "@json-schema-forms/react"
import { theme, controls, layouts } from "../src/index.js"

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      canvas: {
        sourceState: "shown",
      },
      source: {
        transform: (input: string) =>
          prettier.format(input, { parser: "typescript", plugins: [parser] }),
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Stories />
        </>
      ),
    },
  },
  decorators: [
    (Story) => (
      <React.StrictMode>
        <ChakraProvider theme={extendTheme(theme)}>
          <FormComponentsProvider controls={controls} layouts={layouts}>
            <Story />
          </FormComponentsProvider>
        </ChakraProvider>
      </React.StrictMode>
    ),
  ],
}

export default preview
