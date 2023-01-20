import _ from "lodash/fp.js"
import F from "futil"
import { joinPaths } from "./util.js"

const empty = {
  null: null,
  number: 0,
  integer: 0,
  boolean: false,
  string: "",
  array: [],
  object: {},
}

const jsonSchemaType = (value) => {
  if (_.isArray(value)) return "array"
  if (_.isNull(value)) return "null"
  return typeof value
}

// Inspired by https://github.com/sagold/json-schema-library#gettemplate
export const getSchemaValue = (schema, value, path, acc) => {
  acc ||= _.cloneDeep(value ?? schema.default ?? empty[schema.type])

  let current = _.get(path, acc)

  if (!_.isEqual(schema.type, jsonSchemaType(current))) {
    current = _.cloneDeep(schema.default ?? empty[schema.type])
    if (!_.isUndefined(current) && !_.isUndefined(path))
      F.setOn(path, current, acc)
  }

  if (!_.isEmpty(schema.properties))
    F.eachIndexed(
      (property, name) =>
        getSchemaValue(property, value, joinPaths(path, name), acc),
      schema.properties
    )

  if (!_.isEmpty(schema.items)) {
    _.times(
      (index) =>
        getSchemaValue(schema.items, value, joinPaths(path, index), acc),
      _.size(_.isArray(current) ? current : [])
    )
  }

  return acc
}

// TODO
export const extractSubschema = (whitelist, schema) => {
  // const byPointer = _.fromPairs()
  return F.reduceTree((x) => x.properties)({}, schema)
}

// E.g. toSchemaPath('foo.bar') => '/properties/foo/properties/bar'
export const toSchemaPath = (x) => {
  if (!x) return ""
  const path = x
    .replaceAll(/\d+/g, "items")
    .replaceAll(".items", "/items")
    .replaceAll(".", "/properties/")
  return path.startsWith("items") ? path : `/properties/${path}`
}

export const tree = F.tree(
  (x) => x.properties || (x.items && { items: x.items })
)
