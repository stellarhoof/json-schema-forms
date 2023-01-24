import { useContext } from "react"
import { ContextType, Context } from "./Context.js"
import { ReactField } from "./types.js"

export default <P extends object>(field: ReactField<P>) => {
  const { layouts } = useContext<ContextType<P>>(Context)
  const schema = field.schema
  const layout = field.layout
  const Component =
    (typeof layout === "string" ? layouts[layout] : layout) ??
    layouts[field.parent === undefined ? "Form" : ""] ??
    layouts[`type.${schema.type}`] ??
    layouts["NotFound"]
  if (!Component) {
    throw new Error(
      `No layout component found for field at path "${field.path}"`
    )
  }
  return Component
}
