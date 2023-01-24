import { ForwardedRef, forwardRef } from "react"
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertProps,
} from "@chakra-ui/react"
import { ReactField } from "@json-schema-form/react"

type Props<P extends object> = { field: ReactField<P> } & AlertProps

export default forwardRef(
  <P extends object>({ field, ...props }: Props<P>, ref: ForwardedRef<any>) => (
    <Alert ref={ref} status="error" {...props}>
      <AlertIcon />
      <AlertDescription>
        No component found for field at path "{field.path}"
      </AlertDescription>
    </Alert>
  )
)
