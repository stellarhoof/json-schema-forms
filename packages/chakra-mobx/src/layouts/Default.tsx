import { FormControlProps, useMultiStyleConfig } from "@chakra-ui/react"
import { Control, ReactField } from "@json-schema-forms/react"
import { ForwardedRef, forwardRef } from "react"

import Description from "./shared/Description.js"
import Errors from "./shared/Errors.js"
import FormControl from "./shared/FormControl.js"
import RemoveChild from "./shared/RemoveChild.js"
import Title from "./shared/Title.js"

type Props<P extends object> = { field: ReactField<P> } & FormControlProps

export default forwardRef(
  <P extends object>({ field, ...props }: Props<P>, ref: ForwardedRef<any>) => {
    const css = useMultiStyleConfig("@json-schema-forms/layouts/Default", props)
    return (
      <FormControl field={field} sx={css.container} {...props}>
        <Title field={field} sx={css.label}>
          <RemoveChild field={field} sx={css.removeChild} />
        </Title>
        <Control ref={ref} field={field} sx={css.control} />
        <Description field={field} sx={css.description} />
        <Errors field={field} sx={css.errors} />
      </FormControl>
    )
  }
)
