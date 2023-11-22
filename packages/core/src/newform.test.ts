import { describe, it, expect } from "vitest"
import { createEffect, createRoot } from "solid-js"
import { ControlField, LayoutField, createField } from "./newform.js"

const schema = {
  fieldset: {},
  children: [{ name: "age" }, { fieldset: {}, children: [{ name: "height" }] }],
}

const field = createField(schema) as LayoutField
const layout = field.children[1] as LayoutField
const control = layout.children[0] as ControlField

createRoot(() => {
  createEffect(() => {
    console.log({ isDisabled: layout.fieldset!.disabled })
  })
})

field.fieldset!.disabled = true
// control.disabled = false

// const emptyValidation = {
//   willValidate: true,
//   validationMessage: "",
//   checkValidity: expect.any(Function),
//   setCustomValidity: expect.any(Function),
// }
//
// const emptyFieldset = {
//   as: undefined,
//   props: undefined,
//   hidden: false,
//   disabled: false,
//   elements: [],
//   ...emptyValidation,
// }
//
// const emptyLayout = {
//   as: undefined,
//   props: undefined,
//   parents: [],
// }
//
// const emptyControl = {
//   as: undefined,
//   props: undefined,
//   hidden: false,
//   disabled: false,
//   required: false,
//   defaultValue: "",
//   value: "",
//   parents: [],
//   ...emptyValidation,
// }
//
// describe("createField()", () => {
//   it("should throw on invalid schema", () => {
//     expect(() => createField({} as any)).toThrow()
//   })
//
//   it("should create empty ControlField", () => {
//     const schema = {
//       name: "age",
//     }
//     const field = {
//       ...emptyControl,
//       name: "age",
//     }
//     expect(createField(schema)).toEqual(field)
//   })
//
//   it("should create ControlField", () => {
//     const schema = {
//       name: "age",
//       as: "NumberInput",
//       props: { min: 5 },
//       hidden: true,
//       disabled: true,
//       required: true,
//       defaultValue: 10,
//     }
//     const field = {
//       ...emptyControl,
//       name: "age",
//       as: "NumberInput",
//       props: { min: 5 },
//       hidden: true,
//       disabled: true,
//       required: true,
//       defaultValue: 10,
//       value: 10,
//     }
//     expect(createField(schema)).toEqual(field)
//   })
//
//   it("should create empty LayoutField", () => {
//     const schema = {
//       children: [],
//     }
//     const field = {
//       ...emptyLayout,
//       children: [],
//     }
//     expect(createField(schema)).toEqual(field)
//   })
//
//   it.only("should create empty LayoutField with fieldset", () => {
//     const schema = {
//       children: [],
//       fieldset: {},
//     }
//     const field = {
//       ...emptyLayout,
//       fieldset: emptyFieldset,
//       children: [],
//     }
//     expect(createField(schema)).toEqual(field)
//   })
//
//   it("should create empty ArrayLayoutField", () => {
//     const schema = {
//       items: {
//         name: "age",
//       },
//     }
//     const field = {
//       ...emptyLayout,
//       items: {
//         name: "age",
//       },
//       fieldset: emptyFieldset,
//       children: [],
//     }
//     expect(createField(schema)).toEqual(field)
//   })
//
//   it("should create LayoutField with nested ControlField", () => {
//     const schema = {
//       children: [
//         {
//           name: "age",
//         },
//       ],
//     }
//     const field = {
//       ...emptyLayout,
//       children: [
//         {
//           ...emptyControl,
//           name: "age",
//           parents: [expect.any(Object)],
//         },
//       ],
//     }
//     const result = createField(schema) as LayoutField
//     expect(result).toEqual(field)
//     expect(result.children[0].parents[0]).toEqual(result)
//   })
// })
