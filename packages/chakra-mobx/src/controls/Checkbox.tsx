import { ForwardedRef, forwardRef } from "react"
import { observer } from "mobx-react-lite"
import { CheckboxProps, Checkbox } from "@chakra-ui/react"
import { ReactField } from "@json-schema-form/react"

type Props<P extends object> = { field: ReactField<P> } & CheckboxProps

export default observer(
  forwardRef(
    <P extends object>(
      { field, ...props }: Props<P>,
      ref: ForwardedRef<any>
    ) => (
      <Checkbox
        ref={ref}
        value="true"
        isChecked={!!field.value}
        onChange={(e) => (field.value = e.target.checked ?? field.value)}
        {...props}
      />
    )
  )
)
