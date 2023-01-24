import type { Assign } from "utility-types"
import { Checkbox, CheckboxGroup, CheckboxGroupProps } from "@chakra-ui/react"
import { normalizeOptions } from "./normalizeOptions.js"

type Props = Assign<CheckboxGroupProps, Parameters<typeof normalizeOptions>[0]>

export const OptionsCheckboxes = ({
  options,
  valueToLabel,
  ...props
}: Props) => (
  <CheckboxGroup {...props}>
    {normalizeOptions({ options, valueToLabel }).map(({ value, label }) => (
      <Checkbox key={value} value={value}>
        {label}
      </Checkbox>
    ))}
  </CheckboxGroup>
)
