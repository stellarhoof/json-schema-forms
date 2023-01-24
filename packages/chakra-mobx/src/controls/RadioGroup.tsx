import { ForwardedRef, forwardRef } from "react"
import { observer } from "mobx-react-lite"
import {
  OptionsRadioGroup,
  Props as OptionsRadioGroupProps,
} from "./shared/OptionsRadioGroup.js"
import { ReactField } from "@json-schema-form/react"

type Props<P extends object> = { field: ReactField<P> } & OptionsRadioGroupProps

export default observer(
  forwardRef(
    <P extends object>(
      { field, options, ...props }: Props<P>,
      ref: ForwardedRef<any>
    ) => (
      <OptionsRadioGroup
        ref={ref}
        value={field.value}
        options={options ?? field.schema.enum}
        onChange={(value) => (field.value = value ?? field.value)}
        {...props}
      />
    )
  )
)
