import { Textarea,TextareaProps } from "@chakra-ui/react"
import { ReactField } from "@json-schema-forms/react"
import { observer } from "mobx-react-lite"
import { ForwardedRef, forwardRef } from "react"

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
