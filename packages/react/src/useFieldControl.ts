import { useContext } from "react"
import { ContextType, Context } from "./Context.js"
import { ReactField } from "./types.js"

export default <P extends object>(field: ReactField<P>) => {
  const { controls } = useContext<ContextType<P>>(Context)
  const schema = field.schema
  const control = field.control
  const Component =
    (typeof control === "string" ? controls[control] : control) ??
    controls[Array.isArray(schema.enum) ? "Select" : ""] ??
    controls[`type.${schema.type}`] ??
    controls["NotFound"]
  if (!Component) {
    throw new Error(
      `No control component found for field at path "${field.name}"`
    )
  }
  return Component
}
