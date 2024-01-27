import {
  Collection,
  TraversalContext,
  Tree,
} from "@json-schema-forms/tree-utils"
import _ from "lodash/fp.js"

export type TraversableSchema = {
  type: string
  properties?: Record<string, TraversableSchema>
  items?: TraversableSchema
}

export const jsonSchemaTree = new Tree<TraversableSchema>({
  getChildren(schema) {
    if (schema.type === "object" && schema.properties) {
      return schema.properties as Collection<typeof schema>
    }
    if (schema.type === "array" && schema.items) {
      return { "*": schema.items } as Record<
        string,
        TraversableSchema
      > as Collection<typeof schema>
    }
  },
  setChildren(schema, children) {
    if (schema.type === "object") {
      return {
        ...schema,
        properties: { ...schema.properties, ...children },
      } as typeof schema
    }
    if (schema.type === "array" && "*" in children) {
      return { ...schema, items: children["*"] } as typeof schema
    }
    return schema
  },
})

export const getChildrenSchemasFromValue =
  (value?: any) =>
  <T extends TraversableSchema>(
    schema: T,
    ctx: TraversalContext<T>
  ): Collection<T> | undefined => {
    if (schema.type === "object") {
      return schema.properties as Collection<T>
    }
    if (schema.type === "array") {
      return _.times(
        () => _.cloneDeep(schema.items),
        _.size(ctx.path ? _.get(ctx.path, value) : value)
      ) as Collection<T>
    }
  }
