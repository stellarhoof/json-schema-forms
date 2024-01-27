import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from "@chakra-ui/react"
import { Field } from "@json-schema-forms/core"
import { ReactField } from "@json-schema-forms/react"
import { observer } from "mobx-react-lite"
import { ForwardedRef, forwardRef } from "react"

export const useNumberSchema = (schema: Field["schema"]) => {
  if (schema.type !== "number" && schema.type !== "integer") {
    return {}
  }

  const min =
    schema.minimum ??
    (schema.exclusiveMinimum !== undefined
      ? schema.exclusiveMinimum + 1
      : undefined)

  const max =
    schema.maximum ??
    (schema.exclusiveMaximum !== undefined
      ? schema.exclusiveMaximum - 1
      : undefined)

  const step = schema.multipleOf ?? (schema.type === "integer" ? 1 : undefined)

  return { min, max, step }
}

type Props<P extends object> = { field: ReactField<P> } & NumberInputProps

export default observer(
  forwardRef(
    <P extends object>(
      { field, ...props }: Props<P>,
      ref: ForwardedRef<any>
    ) => {
      const { min, max, step } = useNumberSchema(field.schema)
      return (
        <NumberInput
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={field.value}
          onChange={(str, num) => (field.value = num ?? field.value)}
          {...props}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )
    }
  )
)
