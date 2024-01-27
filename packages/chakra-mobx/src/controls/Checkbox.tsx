import { Checkbox,CheckboxProps } from "@chakra-ui/react"
import { ReactField } from "@json-schema-forms/react"
import { observer } from "mobx-react-lite"
import { ForwardedRef, forwardRef } from "react"

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
