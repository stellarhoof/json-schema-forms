import { createMultiStyleConfigHelpers } from "@chakra-ui/react"
import mapValues from "lodash/fp/mapValues.js"

const components = {
  Checkbox: {
    baseStyle: {
      control: {
        alignSelf: "start",
        mt: "1",
      },
    },
  },
  "@json-schema-forms/layouts/Form": {
    parts: ["container", "label", "description", "control", "errors"],
    baseStyle: {
      label: {
        fontFamily: "heading",
        fontWeight: "bold",
        fontSize: "xl",
      },
      description: {
        mb: 6,
        fontSize: "md",
      },
      control: {
        gap: 6,
      },
      errors: {
        mt: 6,
      },
    },
  },
  "@json-schema-forms/layouts/Fieldset": {
    parts: [
      "container",
      "label",
      "description",
      "control",
      "errors",
      "addChild",
      "removeChild",
    ],
    baseStyle: {
      container: {
        display: "grid",
        gap: 6,
        padding: 4,
        borderRadius: "base",
        borderWidth: "1px",
      },
      label: {
        "[data-index]::after": {
          content: '" #"attr(data-index)',
        },
      },
      removeChild: {
        position: "absolute",
        top: 0,
        right: 4,
      },
      description: {
        mt: 0,
      },
      errors: {
        "> :first-of-type": {
          mt: 0,
        },
      },
      addChild: {
        justifySelf: "start",
      },
      control: {
        gap: 6,
      },
    },
  },
  "@json-schema-forms/layouts/Default": {
    parts: [
      "container",
      "label",
      "description",
      "control",
      "errors",
      "removeChild",
    ],
    baseStyle: {
      label: {
        "[data-index]::after": {
          content: '" #"attr(data-index)',
        },
      },
      removeChild: {
        position: "absolute",
        top: 0,
        right: 0,
      },
    },
  },
  "@json-schema-forms/layouts/Checkbox": {
    parts: ["container", "label", "description", "control", "errors"],
    baseStyle: {
      label: {
        cursor: "pointer",
        mb: 0,
      },
      description: {
        mt: 0,
      },
    },
  },
}

export default {
  components: mapValues(
    (config: Record<string, any>) =>
      createMultiStyleConfigHelpers(config.parts).defineMultiStyleConfig(
        config
      ),
    components
  ),
}
