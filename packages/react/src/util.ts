import { HTMLInputTypeAttribute } from "react"
import { ReactField } from "./types.js"

/**
 * Input types that make sense for a form field
 */
type InputType = Exclude<
  HTMLInputTypeAttribute,
  | "button"
  | "image"
  | "reset"
  | "submit"
  // Superseded by `field.hidden`
  | "hidden"
  // This is some weird type union they've got :/
  | object
>

export const getFieldInputType = <P extends object>(
  field: ReactField<P>
): InputType => {
  const fromStringFormat: Record<string, InputType> = {
    date: "date",
    time: "time",
    "date-time": "datetime-local",
    email: "email",
    "idn-email": "email",
    uri: "url",
    iri: "url",
  }

  if (
    field.schema.type === "string" &&
    field.schema.format !== undefined &&
    field.schema.format in fromStringFormat
  ) {
    return fromStringFormat[field.schema.format]
  }

  if (
    (field.schema.type === "number" || field.schema.type === "integer") &&
    (field.schema.minimum ?? field.schema.exclusiveMinimum) !== undefined &&
    (field.schema.maximum ?? field.schema.exclusiveMaximum) !== undefined
  ) {
    return "range"
  }

  const fromSchemaType: Record<string, InputType> = {
    number: "number",
    integer: "number",
    boolean: "checkbox",
  }

  if (field.schema.type in fromSchemaType) {
    return fromSchemaType[field.schema.type]
  }

  return "text"
}
