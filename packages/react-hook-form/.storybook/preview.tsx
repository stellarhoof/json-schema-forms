import { Preview } from "@storybook/react"
import * as React from "react"

const preview: Preview = {
  decorators: [
    (Story) => (
      <React.StrictMode>
        <Story />
      </React.StrictMode>
    ),
  ],
}

export default preview
