import * as core from "@json-schema-forms/core"
import { ForwardedRef, forwardRef, useContext } from "react"

import { Context, ReactField } from "./Context.jsx"

export const Field = forwardRef(
  (
    { field, ...props }: { field: ReactField } & Record<string, any>,
    ref: ForwardedRef<any>,
  ) => {
    const { notFound, layouts, controls, arrays } = useContext(Context)

    const registry = core.isArrayField(field)
      ? arrays
      : core.isLayoutField(field)
        ? layouts
        : controls

    const Component =
      (typeof field.component === "string"
        ? registry[field.component]
        : field.component) ?? notFound

    return (
      <Component
        ref={ref}
        field={field as any}
        name={(field as any).name}
        {...field.props}
        {...props}
      />
    )
  },
)
