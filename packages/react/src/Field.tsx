import { ForwardedRef, forwardRef } from "react"
import useFieldLayout from "./useFieldLayout.js"
import { ReactField } from "./types.js"

export default forwardRef(
  <P extends object>(
    { field, ...props }: { field: ReactField<P> } & Record<string, any>,
    ref: ForwardedRef<any>
  ) => {
    const Component = useFieldLayout(field)
    return (
      <Component ref={ref} field={field} {...field.layoutProps} {...props} />
    )
  }
)
