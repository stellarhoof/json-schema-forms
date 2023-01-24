import { FormHelperText, FormHelperTextProps } from "@chakra-ui/react"
import { ReactField } from "@json-schema-form/react"

type Props<P extends object> = { field: ReactField<P> } & FormHelperTextProps

export default <P extends object>({ field, ...props }: Props<P>) =>
  field.schema.description !== undefined ? (
    <FormHelperText {...props}>{field.schema.description}</FormHelperText>
  ) : null
