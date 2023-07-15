import _ from "lodash/fp.js"
import {
  JsonSchema,
  getSchemaValue,
  jsonSchemaTree,
} from "@json-schema-forms/json-schema-utils"
import { Field, Context, createField } from "./createField.js"
import { accumulate } from "./util.js"

export interface FormConfig<P extends object = object> {
  defaultValue?: any
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

  const defaultValue = getSchemaValue(jsonSchema, config.defaultValue)

  const store = createStore({
    value: _.cloneDeep(defaultValue),
    defaultValue,
  })

  const context: Context<P> = {
    store,
    createStore,
    fieldMap: new Map<FieldId, Field<P>>(),
    onCreateField(field) {
      const path = field.name
        .split(".")
        .map((k) => (isNaN(parseInt(k)) ? k : "*"))
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

  return createField({ id: Symbol(), jsonSchema, context }) as Field<P>
}
