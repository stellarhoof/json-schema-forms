import { StoryObj } from "@storybook/react"
import { createForm } from "@json-schema-forms/core"
import layouts from "./layouts.js"
import { observable } from "mobx"

/**
 * ```javascript
 * import { layouts } from '@json-schema-forms/chakra-mobx'
 * ```
 */
const meta = {
  title: "Layouts",
  tags: ["autodocs"],
}

export default meta

export const FormLayout: StoryObj<typeof layouts.Form> = {
  render: () => {
    // Pass `{ createStore: observable }` to make controls interactive
    const form = createForm({
      type: "string",
      title: "Title",
      description: "Description",
      onCreateField(field) {
        field.setCustomValidity("Error 1\nError 2")
      },
    })
    return <layouts.Form field={form} />
  },
}

export const DefaultLayout: StoryObj<typeof layouts.Default> = {
  render: () => {
    // Pass `{ createStore: observable }` to make controls interactive
    const form = createForm({
      type: "string",
      title: "Title",
      description: "Description",
      onCreateField(field) {
        field.setCustomValidity("Error 1\nError 2")
      },
    })
    return <layouts.Default field={form} />
  },
}

export const FieldsetLayout: StoryObj<typeof layouts.Fieldset> = {
  render: () => {
    // Pass `{ createStore: observable }` to make controls interactive
    const form = createForm({
      type: "string",
      title: "Title",
      description: "Description",
      onCreateField(field) {
        field.setCustomValidity("Error 1\nError 2")
      },
    })
    return <layouts.Fieldset field={form} />
  },
}

export const CheckboxLayout: StoryObj<typeof layouts.Checkbox> = {
  render: () => {
    // Pass `{ createStore: observable }` to make controls interactive
    const form = createForm(
      {
        type: "boolean",
        title: "Title",
        description: "Description",
        onCreateField(field) {
          field.setCustomValidity("Error 1\nError 2")
        },
      },
      { createStore: observable }
    )
    return <layouts.Checkbox field={form} />
  },
}
