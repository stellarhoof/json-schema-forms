import { describe, expect,it } from "vitest"

import { propLens,Tree } from "./index.js"
import { TraversalContext } from "./tree.js"
import { isPlainObject } from "./util.js"

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

const simpleTree = new Tree()

const simpleTreeValue: Json = {
  name: "The Empire Strikes Back",
  planets: ["Aldeeran", { name: "Tatooine" }],
}

const childrenTree = new Tree<{ children: any }>(propLens("children"))

const childrenTreeValue: Json = {
  name: "Anakin Skywalker",
  children: [
    {
      name: "Luke Skywalker",
      children: {
        film: { title: "A New Hope" },
      },
    },
  ],
}

describe("forEach", () => {
  type Acc = { node: Json; context: TraversalContext<Json> }[]

  const accumulateArgs =
    (acc: Acc) => (node: Json, context: TraversalContext<Json>) => {
      acc.push({ node, context })
    }

  it("pre simpleTree", () => {
    const args: Acc = []
    simpleTree.forEach({ pre: accumulateArgs(args) }, simpleTreeValue)
    expect(args).toMatchSnapshot()
  })

  it("post simpleTree", () => {
    const args: Acc = []
    simpleTree.forEach({ post: accumulateArgs(args) }, simpleTreeValue)
    expect(args).toMatchSnapshot()
  })

  it("pre childrenTree", () => {
    const args: Acc = []
    childrenTree.forEach({ pre: accumulateArgs(args) }, childrenTreeValue)
    expect(args).toMatchSnapshot()
  })

  it("post childrenTree", () => {
    const args: Acc = []
    childrenTree.forEach({ post: accumulateArgs(args) }, childrenTreeValue)
    expect(args).toMatchSnapshot()
  })
})

describe("reduce", () => {
  const init: { node: Json; ctx: TraversalContext<Json> }[] = []

  it("pre simpleTree", () => {
    const result = simpleTree.reduce(
      { pre: (acc, node, ctx) => [...acc, { node, ctx }] },
      init,
      simpleTreeValue
    )
    expect(result).toMatchSnapshot()
  })

  it("post simpleTree", () => {
    const result = simpleTree.reduce(
      { post: (acc, node, ctx) => [...acc, { node, ctx }] },
      init,
      simpleTreeValue
    )
    expect(result).toMatchSnapshot()
  })

  it("pre childrenTree", () => {
    const result = childrenTree.reduce(
      {
        pre: (acc, node, ctx) => [...acc, { node, ctx }],
      },
      init,
      childrenTreeValue
    )
    expect(result).toMatchSnapshot()
  })

  it("post childrenTree", () => {
    const result = childrenTree.reduce(
      {
        post: (acc, node, ctx) => [...acc, { node, ctx }],
      },
      init,
      childrenTreeValue
    )
    expect(result).toMatchSnapshot()
  })
})

describe("map", () => {
  const callback = (node: Json) => {
    if (typeof node === "string") {
      return `${node} added[string]`
    }
    if (Array.isArray(node)) {
      return [...node, "added[array]"]
    }
    if (isPlainObject(node)) {
      return { ...node, key: "added[object]" }
    }
    return node
  }

  it("pre simpleTree", () => {
    const result = simpleTree.map({ pre: callback }, simpleTreeValue)
    expect(result).toMatchSnapshot()
  })

  it("post simpleTree", () => {
    const result = simpleTree.map({ post: callback }, simpleTreeValue)
    expect(result).toMatchSnapshot()
  })

  it("pre childrenTree", () => {
    const result = childrenTree.map({ pre: callback }, childrenTreeValue)
    expect(result).toMatchSnapshot()
  })

  it("post childrenTree", () => {
    const result = childrenTree.map({ post: callback }, childrenTreeValue)
    expect(result).toMatchSnapshot()
  })
})

describe("filter", () => {
  it("should return empty when root node is filtered out", () => {
    expect(simpleTree.filter({ pre: (x) => !x }, "root")).toEqual(undefined)
    expect(simpleTree.filter({ pre: (x) => !x }, {})).toEqual(undefined)
  })

  it("should return root node when root node is not filtered out", () => {
    expect(simpleTree.filter({ pre: (x) => !!x }, "root")).toEqual("root")
    expect(simpleTree.filter({ pre: (x) => !!x }, {})).toEqual({})
  })

  it("should filter out nested collection before traversing into it", () => {
    const result = simpleTree.filter(
      { pre: (x) => !Array.isArray(x) },
      { a: "a", b: ["a", "b"] }
    )
    expect(result).toEqual({ a: "a" })
  })

  it("should filter out value inside nested collection", () => {
    const result = simpleTree.filter(
      { pre: (x: any) => x !== "b" },
      { a: "a", b: ["a", "b"] }
    )
    expect(result).toEqual({ a: "a", b: ["a"] })
  })

  it("should filter out empty values and collections in post-order traversal", () => {
    const result = simpleTree.filter(
      { post: (x: any) => x !== "b" && !(Array.isArray(x) && x.length === 0) },
      { a: "a", b: ["b", "b"] }
    )
    expect(result).toEqual({ a: "a" })
  })

  it("should filter out empty values and leave empty collections in pre-order traversal", () => {
    const result = simpleTree.filter(
      { pre: (x: any) => x !== "b" && !(Array.isArray(x) && x.length === 0) },
      { a: "a", b: ["b", "b"] }
    )
    expect(result).toEqual({ a: "a", b: [] })
  })
})

describe("find", () => {
  it("tree should return undefined given no node found", () => {
    const node = simpleTree.find(() => false, simpleTreeValue)
    expect(node).toEqual(undefined)
  })

  it("tree should return nested node/path given function predicate", () => {
    const node = simpleTree.find(
      (n) => typeof n === "string" && n === "Tatooine",
      simpleTreeValue
    )
    expect(node).toEqual("Tatooine")
  })

  it("childrenTree should return undefined given no node found", () => {
    const node = childrenTree.find(() => false, childrenTreeValue)
    expect(node).toEqual(undefined)
  })

  it("childrenTree should find nested node/path given function predicate", () => {
    const node = childrenTree.find(
      (n, { key }) => key === "film",
      childrenTreeValue
    )
    expect(node).toEqual({ title: "A New Hope" })
  })
})
