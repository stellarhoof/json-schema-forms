import { chakra, FormLabel, FormLabelProps } from "@chakra-ui/react"
import { ReactField } from "@json-schema-form/react"
import { observer } from "mobx-react-lite"

type Props<P extends object> = { field: ReactField<P> } & FormLabelProps

export default observer(
  <P extends object>({ field, children, ...props }: Props<P>) => (
    <FormLabel {...props}>
      {field.schema.title ? (
        <chakra.span
          className="title"
          data-index={
            field.parent?.schema.type === "array" ? field.key : undefined
          }
        >
          {field.schema.title}
        </chakra.span>
      ) : (
        <chakra.span w="0">&nbsp;</chakra.span>
      )}
      {children}
    </FormLabel>
  )
)
