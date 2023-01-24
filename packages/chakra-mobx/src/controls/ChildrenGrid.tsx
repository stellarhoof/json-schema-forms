import { ForwardedRef, forwardRef } from "react"
import { observer } from "mobx-react-lite"
import { Grid, GridProps } from "@chakra-ui/react"
import { Field, ReactField } from "@json-schema-form/react"

type Props<P extends object> = { field: ReactField<P> } & GridProps

export default observer(
  forwardRef(
    <P extends object>({ field, ...props }: Props<P>, ref: ForwardedRef<any>) =>
      field.children ? (
        <Grid ref={ref} {...props}>
          {Object.values(field.children).map((field) => (
            <Field key={field.path.join(".")} field={field} />
          ))}
        </Grid>
      ) : null
  )
)
