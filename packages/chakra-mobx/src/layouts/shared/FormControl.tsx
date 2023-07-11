import { observer } from "mobx-react-lite"
import { FormControl, FormControlProps } from "@chakra-ui/react"
import { ReactField } from "@json-schema-forms/react"

type Props<P extends object> = { field: ReactField<P> } & FormControlProps

export default observer(<P extends object>({ field, ...props }: Props<P>) => (
  <FormControl
    data-dirty={field.dirty ? "" : undefined}
    hidden={field.hidden}
    isRequired={field.required}
    isDisabled={field.disabled}
    isInvalid={!field.checkValidity()}
    {...props}
  />
))
