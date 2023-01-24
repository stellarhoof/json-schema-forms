import { ForwardedRef, forwardRef } from "react"
import { observer } from "mobx-react-lite"
import { TextareaProps, Textarea } from "@chakra-ui/react"
import { ReactField } from "@json-schema-form/react"

type Props<P extends object> = { field: ReactField<P> } & TextareaProps

export default observer(
  forwardRef(
    <P extends object>(
      { field, ...props }: Props<P>,
      ref: ForwardedRef<any>
    ) => (
      <Textarea
        ref={ref}
        value={field.value}
        onChange={(e) => (field.value = e.target.value ?? field.value)}
        {...props}
      />
    )
  )
)
