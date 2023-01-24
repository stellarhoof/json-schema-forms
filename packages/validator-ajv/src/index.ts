import _ from "lodash/fp.js"
import ajvModule, { ErrorObject } from "ajv"
import { Tree } from "@json-schema-form/tree-utils"
import { Field, formTree } from "@json-schema-form/core"

const Ajv = ajvModule.default

const isBlank = _.overSome([
  _.isNil,
  _.isEqual(""),
  _.isEqual([]),
  _.isEqual({}),
])

const isNotBlank = _.negate(isBlank)

const getErrorPath = (e: ErrorObject) => {
  let path = e.instancePath.replace("/", "").replaceAll("/", ".")
  if (e.keyword === "required") {
    path = path
      ? `${path}.${e.params.missingProperty}`
      : e.params.missingProperty
  }
  return path
}

const getErrorMessage = (e: ErrorObject) => {
  if (e.keyword === "required") {
    return "this field is required"
  }
  if (e.keyword === "additionalProperties") {
    return `must NOT have additional property: "${e.params.additionalProperty}"`
  }
  // if (e.keyword === 'enum') {
  //   return `must be one of ${JSON.stringify(
  //     e.params.allowedValues
  //   )} but got ${JSON.stringify(_.get(path, value))}`
  // }
  return e.message
}

const tree = new Tree()

const defaultAjv = new Ajv({ strict: true, verbose: true, allErrors: true })

export const validate = <P extends object>(
  field: Field<P>,
  options?: {
    ajv?: typeof defaultAjv
    errors?: ErrorObject[] | null
  }
): boolean => {
  let errors = options?.errors
  const ajv = options?.ajv ?? defaultAjv

  if (!errors) {
    ajv.validate(field.schema, tree.filter(isNotBlank, field.value))
    errors = ajv.errors
  }

  const grouped = _.groupBy(getErrorPath, errors)

  formTree.forEach((child) => {
    const path = child.path.slice(field.path.length)
    const error = (grouped[path.join(".")] ?? [])
      .map(getErrorMessage)
      .join("\n")
    child.setCustomValidity(error)
  }, field)

  return _.isEmpty(errors)
}
