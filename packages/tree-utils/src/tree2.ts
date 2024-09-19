import { isPlainObject } from "./util.js"

type Key = string | number

type It<T> = [Key, T][]

export interface Context<T> {
  key?: Key
  path: Key[]
  depth: number
  parents?: T[]
}

const nextContext = <T>(parent: T, key: Key, ctx: Context<T>): Context<T> => ({
  key,
  path: key !== undefined ? [...ctx.path, key] : [],
  depth: ctx.depth + 1,
  parents: [parent, ...(ctx.parents ?? [])],
})

export interface Options<Node, PreNode, PostNode> {
  getChildren?(node: Node, ctx: Context<Node>): It<Node> | undefined
  pre?(node: Node, ctx: Context<Node>): PreNode
  post?(node: PreNode, ctx: Context<Node>): PostNode
  setChildren?(
    node: PostNode,
    children: It<PostNode>,
    ctx: Context<Node>,
  ): PostNode
}

function defaultGetChildren<Node>(node: Node) {
  if (Array.isArray(node)) {
    const result = []
    for (const [key, val] of node.entries()) {
      result.push([key, val])
    }
    return result
  }
  if (isPlainObject(node)) {
    return Object.entries(node)
  }
}

export function map<Node, PreNode, PostNode>(
  {
    getChildren = defaultGetChildren,
    pre = (node) => node as unknown as PreNode,
    post = (node) => node as unknown as PostNode,
    setChildren = (node) => node,
  }: Options<Node, PreNode, PostNode>,
  node: Node,
) {
  function rec(node: Node, ctx: Context<Node>): PostNode {
    const preResult = pre(node, ctx)
    const children = getChildren(node, ctx)
    if (children) {
      const postNodes = children.map(
        ([key, val]) =>
          [key, rec(val, nextContext(node, key, ctx))] as [Key, PostNode],
        children,
      )
      const postNode = post(preResult, ctx)
      return setChildren(postNode, postNodes, ctx)
    }
    return post(preResult, ctx)
  }
  return rec(node, { depth: 0, path: [] })
}
