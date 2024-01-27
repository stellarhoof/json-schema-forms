import { Radio, RadioGroup, RadioGroupProps } from "@chakra-ui/react"
import { forwardRef } from "react"
import type { Assign } from "utility-types"

import { normalizeOptions } from "./normalizeOptions.js"

export type Props = Assign<
  Omit<RadioGroupProps, "children">,
  Parameters<typeof normalizeOptions>[0]
>

export const OptionsRadioGroup = forwardRef<any, Props>(
  ({ options, valueToLabel, ...props }, ref) => (
    <RadioGroup ref={ref} {...props}>
      {normalizeOptions({ options, valueToLabel }).map(({ value, label }) => (
        <Radio key={value} value={value}>
          {label}
        </Radio>
      ))}
    </RadioGroup>
  )
)
