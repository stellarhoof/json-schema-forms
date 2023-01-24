import _ from "lodash/fp.js"
import set from "lodash/set.js"
import { Tree } from "@json-schema-form/tree-utils"
import type { JsonSchema } from "./types.js"
import { getChildrenSchemasFromValue, TraversableSchema } from "./tree.js"

const jsonSchemaType = (value: any) => {
  if (Array.isArray(value)) return "array"
  if (value === null) return "null"
  return typeof value
}

const empty = {
  null: null,
  number: 0,
  integer: 0,
  boolean: false,
  string: "",
  array: [],
  object: {},
}

const getSchemaDefault = <T extends object>(schema: JsonSchema<T>) =>
  _.cloneDeep(schema.default ?? empty[schema.type])

/**
 * Inspired by https://github.com/sagold/json-schema-library#gettemplate
 */
export const getSchemaValue = <T extends object>(
  schema: JsonSchema<T>,
  value?: any
): any => {
  const wrappedValue = {
    "": _.cloneDeep(value) ?? getSchemaDefault(schema),
  }

  const wrappedSchema: JsonSchema<T> = {
    type: "object",
    properties: { "": schema },
  }

  const tree = new Tree<TraversableSchema>({
    getChildren: getChildrenSchemasFromValue(wrappedValue),
  })

  const result = tree.reduce(
    (acc, schema, { path }) => {
      if (path) {
        let current = _.get(path, acc)
        if (schema.type !== jsonSchemaType(current)) {
          current = getSchemaDefault(schema)
          if (current !== undefined) set(acc, path, current)
        }
      }
      return acc
    },
    wrappedValue,
    wrappedSchema
  )

  return result[""]
}

// E.g. toSchemaPath('foo.bar') => '/properties/foo/properties/bar'
export const dottedPathToSchemaPath = (x: string) => {
  const path = x
    .replaceAll(/\d+/g, "items")
    .replaceAll(".items", "/items")
    .replaceAll(".", "/properties/")
  return path.startsWith("items") ? path : `/properties/${path}`
}
