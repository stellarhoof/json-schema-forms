import { Select, SelectProps } from "@chakra-ui/react"
import { forwardRef } from "react"
import type { Assign } from "utility-types"

import { normalizeOptions } from "./normalizeOptions.js"

export type Props = Assign<SelectProps, Parameters<typeof normalizeOptions>[0]>

export const OptionsSelect = forwardRef<any, Props>(
  ({ options, valueToLabel, ...props }, ref) => (
    <Select ref={ref} {...props}>
      {normalizeOptions({ options, valueToLabel }).map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  )
)
