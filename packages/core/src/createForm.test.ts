// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import {
  JsonSchema,
  jsonSchemaTree,
} from "@json-schema-forms/json-schema-utils"
import { FormConfig, FormSchema, createForm } from "./createForm.js"

describe("createForm()", () => {
  type P = { setBy: string }

  const jsonSchema = {
    type: "object",
    properties: {
      colors: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  } as const

  describe("onCreateField()", () => {
    it("should call config onCreateField before field onCreateField", () => {
      const formSchema = jsonSchemaTree.map<JsonSchema, FormSchema<P>>(
        (schema) => ({
          ...schema,
          onCreateField: (field) => {
            field.setBy = "onCreateField(field)"
          },
        }),
        jsonSchema
      )

      const config: FormConfig<P> = {
        value: { colors: ["red"] },
        onCreateField: (field) => {
          field.setBy = "onCreateField(config)"
        },
      }

      let field = createForm(formSchema, config)
      expect(field.setBy).toEqual("onCreateField")

      field = (field.children as Record<string, any>).colors
      expect(field.setBy).toEqual("onCreateField")

      field = (field.children as any[])[0]
      expect(field.setBy).toEqual("onCreateField")
    })

    it("should call cleanup functions returned by onCreateField", () => {
      const paths = [] as string[]

      const formSchema = jsonSchemaTree.map<JsonSchema, FormSchema<P>>(
        (schema) => ({
          ...schema,
          onCreateField: (field) => () => {
            paths.push(field.path.join("."))
          },
        }),
        jsonSchema
      )

      createForm(formSchema, { value: { colors: ["red"] } }).cleanup()
      expect(paths).toEqual(["colors.0", "colors", ""])
    })
  })
})
