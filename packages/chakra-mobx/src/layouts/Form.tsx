import { FormControlProps, useMultiStyleConfig } from "@chakra-ui/react"
import { Control, ReactField } from "@json-schema-forms/react"
import { ForwardedRef, forwardRef } from "react"

import Description from "./shared/Description.js"
import Errors from "./shared/Errors.js"
import FormControl from "./shared/FormControl.js"
import Title from "./shared/Title.js"

type Props<P extends object> = { field: ReactField<P> } & FormControlProps

export default forwardRef(
  <P extends object>({ field, ...props }: Props<P>, ref: ForwardedRef<any>) => {
    const css = useMultiStyleConfig("@json-schema-forms/layouts/Form", props)
    return (
      <FormControl as="fieldset" field={field} sx={css.container} {...props}>
        <Title field={field} sx={css.label} />
        <Description field={field} sx={css.description} />
        <Control ref={ref} field={field} sx={css.control} />
        <Errors field={field} sx={css.errors} />
      </FormControl>
    )
  }
)
