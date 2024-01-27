import { FormControlProps, useMultiStyleConfig } from "@chakra-ui/react"
import { Control, ReactField } from "@json-schema-forms/react"
import { ForwardedRef, forwardRef } from "react"

import AddChild from "./shared/AddChild.js"
import Description from "./shared/Description.js"
import Errors from "./shared/Errors.js"
import FormControl from "./shared/FormControl.js"
import RemoveChild from "./shared/RemoveChild.js"
import Title from "./shared/Title.js"

type Props<P extends object> = { field: ReactField<P> } & FormControlProps

export default forwardRef(
  <P extends object>({ field, ...props }: Props<P>, ref: ForwardedRef<any>) => {
    const css = useMultiStyleConfig("@json-schema-forms/layouts/Fieldset", props)
    return (
      <FormControl as="fieldset" field={field} sx={css.container} {...props}>
        <Title as="legend" field={field} sx={css.label}>
          <RemoveChild field={field} sx={css.removeChild} />
        </Title>
        <Description field={field} sx={css.description} />
        <Errors field={field} sx={css.errors} />
        <AddChild field={field} sx={css.addChild} />
        <Control ref={ref} field={field} sx={css.control} />
      </FormControl>
    )
  }
)
