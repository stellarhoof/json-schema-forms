import _ from "lodash/fp.js"
import F from "futil"
import { extendObservable, isObservable, observable, toJS } from "mobx"
import { joinPaths } from "./util.js"
import { tree, getSchemaValue } from "./schema.js"

const mut = _.convert({ immutable: false })

const formTree = F.tree((schema) => schema.properties || schema.field?.items)

const reduceSchema = _.curryN(2, (fn, schema) =>
  formTree.reduce((acc, schema) => {
    const result = fn(schema)
    if (result !== undefined) acc[schema.field.path] = result
    return acc
  })({}, schema)
)

export const getFlatSchema = reduceSchema(_.identity)

export const getFlatSchemaValue = reduceSchema((schema) => {
  if (!schema.field.disabled && !schema.properties && !schema.items) {
    return schema.field.value
  }
})

export const toJsonSchema = (schema) => {
  schema = toJS(schema)
  tree.walk((schema) => {
    delete schema.field
    delete schema.items?.field
  })(schema)
  return schema
}

const addGenericProperties = (schema, value, validate) => {
  extendObservable(schema.field, {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
    // Semantically, json-schema's readOnly is closer to HTML's disabled,
    // since json-schema readOnly values should not get sent to the server
    __disabled: !!schema.readOnly,
    get path() {
      return joinPaths(
        schema.field.parentSchema?.field?.path,
        schema.field.name
      )
    },
    get value() {
      return _.get(joinPaths("__root__", schema.field.path), value)
    },
    set value(x) {
      mut.set(joinPaths("__root__", schema.field.path), x, value)
    },
    get required() {
      return (
        schema.field.parentSchema?.type === "object" &&
        schema.field.willValidate &&
        _.includes(schema.field.name, schema.field.parentSchema?.required)
      )
    },
    set required(x) {
      if (schema.field.parentSchema?.type === "object") {
        let fn = x ? _.union : _.difference
        schema.field.parentSchema.required = fn(
          schema.field.parentSchema.required,
          [schema.field.name]
        )
      }
    },
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
    get disabled() {
      return !!(
        (schema.field.parentSchema?.field?.disabled || 0) +
        (schema.field.__disabled ? 1 : 0)
      )
    },
    set disabled(x) {
      schema.field.__disabled = x
    },
    // Inspired by https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation
    // Whether the field will be validated when the form is submitted
    get willValidate() {
      return (
        !schema.field.readonly && !schema.field.hidden && !schema.field.disabled
      )
    },
    // Message describing the validation constraints that the field doesn't
    // satisfy (if any). If the field is not a candidate for constraint
    // validation (willValidate is false) or the element's value satisfies its
    // constraints (is valid), return an empty string.
    get validationMessage() {
      return schema.field.willValidate
        ? schema.field.__validationMessage
        : undefined
    },
    // Add a custom error message to the field; if a custom error message is
    // set, the field is considered to be invalid, and the specified error
    // should be displayed in the UI.
    setCustomValidity(x) {
      schema.field.__validationMessage = x
    },
    // Returns true if the field's value has no validity problems; false
    // otherwise.
    checkValidity() {
      return _.isEmpty(validate?.(schema))
    },
    // Under the constraint validation API, this method reports invalid field(s)
    // using events. Here, we simply call setCustomValidity and assume the
    // errors will be displayed in the UI.
    reportValidity() {
      const errors = _.mapKeys(
        (k) => joinPaths(schema.field.path, k),
        // Validating a single property from a general schema is not possible in
        // the general case and it's complex in relatively simple cases
        // https://github.com/ajv-validator/ajv/issues/211#issuecomment-242997557
        validate?.(schema)
      )
      formTree.walk((schema) => {
        schema.field.setCustomValidity(errors[schema.field.path])
      })(schema)
      return _.isEmpty(errors)
    },
  })
}

const makeSchemaItem = (schema, addFieldsToSchema, index) => {
  const item = toJS(schema.items)
  addFieldsToSchema(item, schema, index)
  return item
}

const addArrayProperties = (schema, addFieldsToSchema) => {
  extendObservable(schema.field, {
    items: _.times(
      (index) => makeSchemaItem(schema, addFieldsToSchema, index),
      _.size(schema.field.value)
    ),
    get canAddItem() {
      return (schema.maxItems ?? -1) < _.size(schema.field.value)
    },
    get canRemoveItem() {
      return (schema.minItems ?? Infinity) >= _.size(schema.field.value)
    },
    addItem(index) {
      index ||= _.size(schema.field.value)
      schema.field.items.splice(
        index,
        0,
        makeSchemaItem(schema, addFieldsToSchema, index)
      )
      schema.field.value.splice(index, 0, getSchemaValue(schema.items))
      for (const item of schema.field.items.slice(index + 1)) item.field.name++
    },
    removeItem(index) {
      schema.field.items.splice(index, 1)
      schema.field.value.splice(index, 1)
      for (const item of schema.field.items.slice(index)) item.field.name--
    },
  })
}

const addObjectProperties = (schema, addFieldsToSchema) => {
  for (const [name, child] of _.toPairs(schema.properties)) {
    addFieldsToSchema(child, schema, name)
  }
}

export const fromJsonSchema = (
  schema,
  { value, validate, onFieldAdd } = {}
) => {
  schema = observable(schema)
  value = observable(getSchemaValue(schema, { __root__: value }, "__root__"))
  const addFieldsToSchema = (schema, parentSchema, name = "") => {
    if (!schema.field) extendObservable(schema, { field: {} })
    // Extend the field with some useful properties but do not make these
    // properties observable
    extendObservable(
      schema.field,
      { id: _.uniqueId(), name, schema, parentSchema },
      { id: false, name: false, schema: false, parentSchema: false }
    )
    addGenericProperties(schema, value, validate)
    if (schema.type === "array") addArrayProperties(schema, addFieldsToSchema)
    if (schema.type === "object") addObjectProperties(schema, addFieldsToSchema)
    onFieldAdd?.(schema)
  }
  addFieldsToSchema(schema)
  return schema
}
