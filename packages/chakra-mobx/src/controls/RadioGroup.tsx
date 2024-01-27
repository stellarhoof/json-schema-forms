import { ReactField } from "@json-schema-forms/react"
import { observer } from "mobx-react-lite"
import { ForwardedRef, forwardRef } from "react"

import {
  OptionsRadioGroup,
  Props as OptionsRadioGroupProps,
} from "./shared/OptionsRadioGroup.js"

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
