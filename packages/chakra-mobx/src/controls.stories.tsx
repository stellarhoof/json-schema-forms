import { observable } from "mobx"
import { Meta, StoryObj } from "@storybook/react"
import { createForm } from "@json-schema-form/core"
import controls from "./controls.js"

/**
 * ```javascript
 * import { controls } from '@json-schema-form/chakra-mobx'
 * ```
 */
const meta: Meta = {
  title: "Controls",
  tags: ["autodocs"],
}

export default meta

export const InputControl: StoryObj<typeof controls.Input> = {
  render: () => {
    const form = createForm({ type: "string" }, { createStore: observable })
    return <controls.Input field={form} />
  },
}

export const TextareaControl: StoryObj<typeof controls.Textarea> = {
  render: () => {
    const form = createForm({ type: "string" }, { createStore: observable })
    return <controls.Textarea field={form} />
  },
}

export const NumberInputControl: StoryObj<typeof controls.NumberInput> = {
  render: () => {
    const form = createForm({ type: "number" }, { createStore: observable })
    return <controls.NumberInput field={form} />
  },
}

export const SliderControl: StoryObj<typeof controls.Slider> = {
  render: () => {
    const form = createForm({ type: "number" }, { createStore: observable })
    return <controls.Slider field={form} />
  },
}

export const SelectControl: StoryObj<typeof controls.Select> = {
  render: () => {
    const form = createForm(
      {
        type: "string",
        enum: ["John", "Smith", "Mitch"],
      },
      { createStore: observable }
    )
    return <controls.Select field={form} />
  },
}

export const RadioGroupControl: StoryObj<typeof controls.RadioGroup> = {
  render: () => {
    const form = createForm(
      {
        type: "string",
        enum: ["John", "Smith", "Mitch"],
      },
      { createStore: observable }
    )
    return <controls.RadioGroup field={form} />
  },
}

export const CheckboxControl: StoryObj<typeof controls.Checkbox> = {
  render: () => {
    const form = createForm({ type: "boolean" }, { createStore: observable })
    return <controls.Checkbox field={form}>Label</controls.Checkbox>
  },
}

export const SwitchControl: StoryObj<typeof controls.Switch> = {
  render: () => {
    const form = createForm({ type: "boolean" }, { createStore: observable })
    return <controls.Switch field={form}>Label</controls.Switch>
  },
}

export const ChildrenGridControl: StoryObj<typeof controls.ChildrenGrid> = {
  render: () => {
    const form = createForm(
      {
        type: "object",
        properties: {
          username: { type: "string", title: "Username" },
          password: { type: "string", title: "Password" },
        },
      },
      { createStore: observable }
    )
    return <controls.ChildrenGrid field={form} />
  },
}
