import { forwardRef, ForwardedRef } from "react"
import { observer } from "mobx-react-lite"
import { Input, InputProps } from "@chakra-ui/react"
import { getFieldInputType, ReactField } from "@json-schema-forms/react"

type Props<P extends object> = { field: ReactField<P> } & InputProps

export default observer(
  forwardRef(
    <P extends object>(
      { field, type, ...props }: Props<P>,
      ref: ForwardedRef<any>
    ) => (
      <Input
        ref={ref}
        type={type ?? getFieldInputType(field)}
        value={field.value ?? ""}
        onChange={(e) => (field.value = e.target.value)}
        {...props}
      />
    )
  )
)
