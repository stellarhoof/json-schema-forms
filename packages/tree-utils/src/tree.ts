import type { Collection } from "./collection.js"
import * as collection from "./collection.js"

export interface TraversalContext<N, K = any> {
  key?: K
  path: K[]
  depth: number
  parents?: N[]
}

export interface ChildrenLens<T> {
  getChildren: <N extends T>(
    node: N,
    ctx: Omit<TraversalContext<N>, "children" | "parents">
  ) => Collection<N> | undefined
  setChildren: <N extends T>(
    node: N,
    children: Collection<N>,
    ctx: Omit<TraversalContext<N>, "children" | "parents">
  ) => N
}

const nextContext = <N>(
  parent: N,
  key: any,
  ctx: TraversalContext<N>
): TraversalContext<N> => ({
  key,
  path: key !== undefined ? [...ctx.path, key] : [],
  depth: ctx.depth + 1,
  parents: [parent, ...(ctx.parents ?? [])],
})

export class StopTraversal extends Error {}

export type Visitor<Fn> = Fn | { pre?: Fn; post?: Fn }

const getCbs = <Fn>(cb: Visitor<Fn>) =>
  (typeof cb === "function" ? { pre: cb, post: undefined } : cb) as {
    pre?: Fn
    post?: Fn
  }

export type ForEachCallback<N> = (node: N, ctx: TraversalContext<N>) => void

export type ForEachVisitor<N> = Visitor<ForEachCallback<N>>

export function forEach<T>(lens: ChildrenLens<T>) {
  return <N extends T>(cb: ForEachVisitor<N>, node: N): void => {
    const { pre, post } = getCbs(cb)
    const rec: ForEachCallback<N> = (node, ctx) => {
      const children = lens.getChildren(node, ctx)
      if (pre) {
        pre(node, ctx)
      }
      collection.forEach((value, key) => {
        rec(value, nextContext(node, key, ctx))
      }, children ?? [])
      if (post) {
        post(node, ctx)
      }
    }
    try {
      rec(node, { depth: 0, path: [] })
    } catch (e) {
      if (e instanceof StopTraversal) {
        return
      }
      throw e
    }
  }
}

export type ReduceCallback<N, R> = (
  result: R,
  node: N,
  ctx: TraversalContext<N>
) => R

export type ReduceVisitor<N, R> = Visitor<ReduceCallback<N, R>>

export function reduce<T>(lens: ChildrenLens<T>) {
  return <N extends T, R>(cb: ReduceVisitor<N, R>, result: R, node: N): R => {
    const { pre, post } = getCbs(cb)
    forEach(lens)(
      {
        pre: pre ? (...args) => (result = pre(result, ...args)) : undefined,
        post: post ? (...args) => (result = post(result, ...args)) : undefined,
      },
      node
    )
    return result
  }
}

export type FindCallback<N> = (node: N, ctx: TraversalContext<N>) => boolean

export type FindVisitor<N> = Visitor<FindCallback<N>>

export function find<T>(lens: ChildrenLens<T>) {
  return <N extends T>(pre: FindCallback<N>, node: N): void => {
    let result = undefined
    forEach(lens)(
      {
        pre: (node, ctx) => {
          if (pre(node, ctx)) {
            result = node
            throw new StopTraversal()
          }
        },
      },
      node
    )
    return result
  }
}

export type FilterCallback<N> = (node: N, ctx: TraversalContext<N>) => boolean

export type FilterVisitor<N> = Visitor<FilterCallback<N>>

export function filter<T>(lens: ChildrenLens<T>) {
  return <N extends T>(cb: FilterVisitor<N>, node: N): N | undefined => {
    const { pre, post } = getCbs(cb)

    const rec = (node: N, ctx: TraversalContext<N>) => {
      const children = lens.getChildren(node, ctx)

      if (pre && !pre(node, ctx)) {
        return
      }

      const mapped = children
        ? collection.map(
            (value, key) => rec(value, nextContext(node, key, ctx)),
            children
          )
        : undefined

      const filtered = mapped
        ? (collection.filter(
            (node) => node !== undefined,
            mapped
          ) as Collection<N>)
        : undefined

      node = filtered ? lens.setChildren(node, filtered, ctx) : node

      if (post && !post(node, ctx)) {
        return
      }

      return node
    }

    return rec(node, { depth: 0, path: [] })
  }
}

export type MapVisitor<N, R, Pre, Post> =
  | ((node: N, ctx: TraversalContext<R>) => R)
  | {
      pre?: Pre extends true ? (node: N, ctx: TraversalContext<R>) => R : never
      post?: Post extends true
        ? (
            node: Pre extends true ? R : N,
            ctx: TraversalContext<Pre extends true ? R : N>
          ) => R
        : never
    }

export function map<T>(lens: ChildrenLens<T>) {
  function map<N extends T, R extends T>(
    cb: MapVisitor<N, R, false, false>,
    node: N
  ): R
  function map<N extends T, R extends T>(
    cb: MapVisitor<N, R, true, false>,
    node: N
  ): R
  function map<N extends T, R extends T>(
    cb: MapVisitor<N, R, false, true>,
    node: N
  ): R
  function map<N extends T, R extends T>(
    cb: MapVisitor<N, R, true, true>,
    node: N
  ): R
  function map<N extends T, R extends T>(
    cb: MapVisitor<N, R, boolean, boolean>,
    node: N
  ): R {
    const { pre, post } = getCbs(cb)

    const rec = (node: N, ctx: TraversalContext<N | R>): R => {
      const children = lens.getChildren(node, ctx)

      let result = node as N | R

      if (pre) {
        result = pre(node, ctx as TraversalContext<R>)
      }

      const mapped = children
        ? collection.map(
            (value, key) => rec(value, nextContext(result, key, ctx)),
            children
          )
        : undefined

      if (post) {
        result = post(result as N, ctx as TraversalContext<R>)
      }

      return (mapped ? lens.setChildren(result, mapped, ctx) : result) as R
    }

    return rec(node, { depth: 0, path: [] })
  }

  return map
}
