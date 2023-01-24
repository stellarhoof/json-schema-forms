import { ForwardedRef, forwardRef } from "react"
import { observer } from "mobx-react-lite"
import { ReactField } from "@json-schema-form/react"
import {
  OptionsSelect,
  Props as OptionsSelectProps,
} from "./shared/OptionsSelect.js"

type Props<P extends object> = {
  field: ReactField<P>
} & OptionsSelectProps

export default observer(
  forwardRef(
    <P extends object>(
      { field, options, ...props }: Props<P>,
      ref: ForwardedRef<any>
    ) => (
      <OptionsSelect
        ref={ref}
        value={field.value}
        options={options ?? field.schema.enum}
        onChange={(e) => (field.value = e.target.value ?? field.value)}
        {...props}
      />
    )
  )
)
