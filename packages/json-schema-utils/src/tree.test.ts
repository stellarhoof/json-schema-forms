// @vitest-environment jsdom

import { describe, expect,it } from "vitest"

import { jsonSchemaTree } from "./tree.js"

describe("jsonSchemaTree()", () => {
  it("should traverse schema.items", () => {
    const schema = {
      type: "array",
      items: {
        type: "string",
      },
    } as const

    const paths = jsonSchemaTree.reduce(
      (paths, schema, ctx) => {
        paths.push(ctx.path)
        return paths
      },
      [] as string[][],
      schema
    )

    expect(paths).toEqual([[], ["*"]])
  })

  it("should map schema.items", () => {
    const schema = {
      type: "array",
      items: {
        type: "string",
      },
    } as const

    const mapped = jsonSchemaTree.map(
      (schema, ctx) =>
        ctx.key === "*" ? { ...schema, type: "number" } : schema,
      schema
    )

    expect(mapped).toEqual({
      type: "array",
      items: {
        type: "number",
      },
    })
  })
})
