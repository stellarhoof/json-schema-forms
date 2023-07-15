import { ForwardedRef, forwardRef } from "react"
import useFieldControl from "./useFieldControl.js"
import { ReactField } from "./types.js"

export default forwardRef(
  <P extends object>(
    { field, ...props }: { field: ReactField<P> } & Record<string, any>,
    ref: ForwardedRef<any>
  ) => {
    const Component = useFieldControl(field)
    return (
      <Component
        ref={ref}
        field={field}
        name={field.name}
        {...field.controlProps}
        {...props}
      />
    )
  }
)
