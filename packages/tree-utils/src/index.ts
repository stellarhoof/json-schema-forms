import type { Collection } from "./collection.js"
import type { ChildrenLens } from "./tree.js"
import { filter, find, forEach,map, reduce } from "./tree.js"
import { isPlainObject } from "./util.js"

export type { Collection } from "./collection.js"
export type * from "./tree.js"
export { StopTraversal } from "./tree.js"
export * from "./util.js"

export class Tree<T> {
  static filter = filter
  public filter
  static find = find
  public find
  static forEach = forEach
  public forEach
  static map = map
  public map
  static reduce = reduce
  public reduce

  constructor({
    getChildren = (node) => {
      if (isPlainObject(node) || Array.isArray(node)) {
        return node as Collection<typeof node>
      }
    },
    setChildren = (node, children) => {
      if (isPlainObject(children) || Array.isArray(children)) {
        return children as typeof node
      }
      return node
    },
  }: Partial<ChildrenLens<T>> = {}) {
    const lens = { getChildren, setChildren }
    this.filter = filter(lens)
    this.find = find(lens)
    this.forEach = forEach(lens)
    this.map = map(lens)
    this.reduce = reduce(lens)
  }
}

export const propLens = (
  key: string
): ChildrenLens<Record<string, unknown>> => ({
  getChildren(node) {
    if (isPlainObject(node) && key in node) {
      return node[key] as Collection<typeof node>
    }
  },
  setChildren(node, children) {
    if (isPlainObject(node)) {
      return { ...node, [key]: children }
    }
    return node
  },
})
