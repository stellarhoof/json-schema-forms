import { describe, expect, it } from "vitest"

import { createField, UISchema } from "./newform.js"

describe("createField()", () => {
  it("should throw on invalid schema", () => {
    expect(() => createField({} as any)).toThrow()
  })

  it("should create empty ControlField", () => {
    const uiSchema: UISchema = {
      name: "age",
    }
    expect(createField(uiSchema)).toEqual({
      parents: [],
      hidden: false,
      required: false,
      defaultValue: "",
      value: "",
      disabled: false,
      name: "age",
      willValidate: true,
      validationMessage: "",
      checkValidity: expect.any(Function),
      setCustomValidity: expect.any(Function),
      $state: {
        name: "age",
        disabled: false,
      },
    })
  })

  it("should create ControlField", () => {
    const uiSchema: UISchema = {
      name: "age",
      hidden: true,
      disabled: true,
      required: true,
    }
    expect(createField(uiSchema)).toEqual({
      parents: [],
      hidden: true,
      required: true,
      defaultValue: "",
      value: "",
      disabled: true,
      name: "age",
      willValidate: false,
      validationMessage: "",
      checkValidity: expect.any(Function),
      setCustomValidity: expect.any(Function),
      $state: {
        name: "age",
        disabled: true,
      },
    })
  })

  it("should create empty LayoutField", () => {
    const schema: UISchema = {
      children: [],
    }
    expect(createField(schema)).toEqual({
      parents: [],
      children: [],
    })
  })

  it("should create empty LayoutField with fieldset", () => {
    const schema: UISchema = {
      children: [],
      fieldset: {},
    }
    expect(createField(schema)).toEqual({
      parents: [],
      children: [],
      fieldset: {
        hidden: false,
        disabled: false,
        willValidate: true,
        validationMessage: "",
        checkValidity: expect.any(Function),
        setCustomValidity: expect.any(Function),
        $state: {
          parents: [],
          disabled: false,
        },
      },
    })
  })

  it("should create empty ArrayLayoutField", () => {
    const schema: UISchema = {
      name: "people",
      items: { name: "age" },
    }
    expect(createField(schema)).toEqual({
      parents: [],
      name: "people",
      items: { name: "age" },
      children: [],
      fieldset: {
        hidden: false,
        disabled: false,
        willValidate: true,
        validationMessage: "",
        checkValidity: expect.any(Function),
        setCustomValidity: expect.any(Function),
        $state: {
          parents: [],
          disabled: false,
        },
      },
    })
  })

  it("should create LayoutField with nested ControlField", () => {
    const schema: UISchema = {
      children: [{ name: "age" }],
    }
    const field = {
      parents: [],
      children: [] as any[],
    }
    field.children.push({
      hidden: false,
      disabled: false,
      required: false,
      defaultValue: "",
      value: "",
      parents: [field],
      willValidate: true,
      validationMessage: "",
      checkValidity: expect.any(Function),
      setCustomValidity: expect.any(Function),
      name: "age",
      $state: {
        name: "age",
        disabled: false,
      },
    })
    expect(createField(schema)).toEqual(field)
  })
})
