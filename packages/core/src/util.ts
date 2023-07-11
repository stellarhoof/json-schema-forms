import {
  Tree,
  Collection,
  TraversalContext,
} from "@json-schema-forms/tree-utils"
import { Field } from "./createField.js"

export const formTree = new Tree<{ children?: Collection<unknown> }>({
  getChildren(field) {
    return field.children as Collection<typeof field>
  },
  setChildren(field, children) {
    field.children = children
    return field
  },
})

export const accumulate =
  <T, R>(fn: (node: T, ctx: TraversalContext<T>) => R) =>
  (acc: Record<string, R>, node: T, ctx: TraversalContext<T>) => {
    const result = fn(node, ctx)
    if (result) {
      acc[ctx.path.join(".")] = result
    }
    return acc
  }
