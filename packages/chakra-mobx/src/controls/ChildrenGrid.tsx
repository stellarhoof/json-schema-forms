import { Grid, GridProps } from "@chakra-ui/react"
import { Field, ReactField } from "@json-schema-forms/react"
import { observer } from "mobx-react-lite"
import { ForwardedRef, forwardRef } from "react"

type Props<P extends object> = { field: ReactField<P> } & GridProps

export default observer(
  forwardRef(
    <P extends object>({ field, ...props }: Props<P>, ref: ForwardedRef<any>) =>
      field.children ? (
        <Grid ref={ref} {...props}>
          {Object.values(field.children).map((field) => (
            <Field key={field.name} field={field} />
          ))}
        </Grid>
      ) : null
  )
)
