import _ from "lodash/fp.js"
import { JsonSchema, getSchemaValue, jsonSchemaTree } from "json-schema-utils"
import { Field, FormContext, createField } from "./createField.js"
import { accumulate } from "./util.js"

export interface FormConfig<P extends object = object> {
  value?: any
  createStore?: <T>(value: T) => T
  onCreateField?: (field: Field<P>) => (() => void) | void
}

export type FormSchema<P extends object> = JsonSchema<{
  onCreateField?: (field: Field<P>) => (() => void) | void
}>

export type FieldId = symbol

export const createForm = <P extends object = object>(
  formSchema: FormSchema<P>,
  config: FormConfig<P> = {}
): Field<P> => {
  // Discard `onCreateField` from the schema
  const jsonSchema = jsonSchemaTree.map(
    _.omit("onCreateField"),
    formSchema
  ) as JsonSchema

  // Extract `onCreateField` from the schema into a flat object
  const onCreateFieldByPath = jsonSchemaTree.reduce(
    accumulate((schema) => schema.onCreateField),
    {} as Record<string, (field: Field) => (() => void) | void>,
    formSchema
  )

  const createStore = config.createStore ?? _.identity

  const normalized = getSchemaValue(jsonSchema, config.value)

  const value = createStore({
    initial: _.cloneDeep(normalized),
    current: normalized,
  })

  const formContext: FormContext<P> = {
    value,
    createStore,
    fieldMap: new Map<FieldId, Field<P>>(),
    onCreateField(field) {
      const path = field.path
        .map((k) => (Number.isInteger(k) ? "*" : k))
        .join(".")
      const disposers = [
        config.onCreateField?.(field),
        onCreateFieldByPath[path]?.(field),
      ]
      field.__state__.dispose = () => {
        for (const fn of disposers) {
          fn?.()
        }
      }
    },
  }

  const field = createField({
    id: Symbol(),
    jsonSchema,
    formContext,
  }) as Field<P>

  return field
}
