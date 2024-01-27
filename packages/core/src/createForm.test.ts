// // @vitest-environment jsdom
//
// import {
//   JsonSchema,
//   jsonSchemaTree,
// } from "@json-schema-forms/json-schema-utils"
// import { describe, expect, it } from "vitest"
//
// import { createForm, FormConfig, FormSchema } from "./createForm.js"
//
// describe("createForm()", () => {
//   type P = { setBy: string }
//
//   const jsonSchema = {
//     type: "object",
//     properties: {
//       colors: {
//         type: "array",
//         items: {
//           type: "string",
//         },
//       },
//     },
//   } as const
//
//   describe("onCreateField()", () => {
//     it("should call config onCreateField before field onCreateField", () => {
//       const formSchema = jsonSchemaTree.map<JsonSchema, FormSchema<P>>(
//         (schema) => ({
//           ...schema,
//           onCreateField: (field) => {
//             field.setBy = "onCreateField(field)"
//           },
//         }),
//         jsonSchema,
//       )
//
//       const config: FormConfig<P> = {
//         defaultValue: { colors: ["red"] },
//         onCreateField: (field) => {
//           field.setBy = "onCreateField(config)"
//         },
//       }
//
//       let field = createForm(formSchema, config)
//       expect(field.setBy).toEqual("onCreateField(field)")
//
//       field = (field.children as Record<string, any>).colors
//       expect(field.setBy).toEqual("onCreateField(field)")
//
//       field = (field.children as any[])[0]
//       expect(field.setBy).toEqual("onCreateField(field)")
//     })
//
//     it("should call cleanup functions returned by onCreateField", () => {
//       const paths = [] as string[]
//
//       const formSchema = jsonSchemaTree.map<JsonSchema, FormSchema<P>>(
//         (schema) => ({
//           ...schema,
//           onCreateField: (field) => () => {
//             paths.push(field.name)
//           },
//         }),
//         jsonSchema,
//       )
//
//       createForm(formSchema, { defaultValue: { colors: ["red"] } }).dispose()
//       expect(paths).toEqual(["colors.0", "colors", ""])
//     })
//   })
// })
