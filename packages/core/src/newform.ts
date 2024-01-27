import { TraversalContext, Tree } from "@json-schema-forms/tree-utils"
import { createMutable } from "solid-js/store"
import { Assign } from "utility-types"

// TODO: Util to get value for all controls under field. A tree reduce on
// [name, value] pairs for controls. Pay special attention to array fields.
// Should we make `name` a getter?
// Q: How do value/defaultValue get assigned?

type UIFieldset = {
  hidden?: boolean
  disabled?: boolean
}

export type UIControlSchema<P extends object = object> = P &
  UIFieldset & {
    name: string
    required?: boolean
  }

export type UILayoutSchema<P extends object = object> = P & {
  children: UISchema<P>[]
  fieldset?: UIFieldset
}

export type UIArraySchema<P extends object = object> = P & {
  name: string
  items: UISchema<P>
  fieldset?: UIFieldset
}

export type UISchema<P extends object = object> =
  | UIControlSchema<P>
  | UILayoutSchema<P>
  | UIArraySchema<P>

export type FieldFieldset = {
  hidden: boolean
  disabled: boolean
  willValidate: boolean
  validationMessage: string
  checkValidity: () => boolean
  setCustomValidity: (message: string) => void
  $state: any
}

export type ControlField<P extends object = object> = P &
  FieldFieldset & {
    parents: Field<P>[]
    name: string
    required: boolean
    defaultValue: any
    value: any
  }

export type LayoutField<P extends object = object> = P & {
  parents: Field<P>[]
  children: Field<P>[]
  fieldset?: FieldFieldset
}

export type ArrayField<P extends object = object> = P & {
  name: string
  items: UISchema<P>
  parents: Field<P>[]
  children: Field<P>[]
  fieldset?: FieldFieldset
}

export type Field<P extends object = object> =
  | ControlField<P>
  | LayoutField<P>
  | ArrayField<P>

const assignProperties = <L extends object, R extends object>(
  left: L,
  right: R,
) => {
  Object.defineProperties(left, Object.getOwnPropertyDescriptors(right))
  return left as Assign<L, R>
}

export const isControlSchema = <T extends UIControlSchema>(x: any): x is T =>
  "name" in x && x.name !== undefined

export const isLayoutSchema = <T extends UILayoutSchema>(x: any): x is T =>
  "children" in x && x.children !== undefined

export const isArraySchema = <T extends UIArraySchema>(x: any): x is T =>
  "name" in x && x.name !== undefined && "items" in x && x.items !== undefined

export const isControlField = <T extends ControlField>(x: any): x is T =>
  "name" in x && x.name !== undefined

export const isLayoutField = <T extends LayoutField>(x: any): x is T =>
  "children" in x && x.children !== undefined

export const isArrayField = <T extends ArrayField>(x: any): x is T =>
  "name" in x && x.name !== undefined && "items" in x && x.items !== undefined

const hasFieldset = (x: any) => "fieldset" in x && x.fieldset !== undefined

const someDisabled = <T extends Field>(fields: T[]) =>
  fields.some(
    (x) =>
      ("disabled" in x && x.disabled) ||
      ("fieldset" in x && x.fieldset!.disabled),
  )

const uiTree = new Tree<any>({
  getChildren(uiSchema) {
    return uiSchema.children
  },
  setChildren(uiSchema, children) {
    uiSchema.children = children
    return uiSchema
  },
})

const createLayoutField = <P extends object = object>(
  uiSchema: UILayoutSchema<P>,
  ctx: TraversalContext<Field<P>>,
) =>
  ({
    parents: ctx.parents ?? [],
    children: [],
    fieldset: !hasFieldset(uiSchema)
      ? undefined
      : {
          hidden: uiSchema.fieldset!.hidden ?? false,
          get disabled() {
            return this.$state.disabled || someDisabled(this.$state.parents)
          },
          set disabled(value) {
            this.$state.disabled = value
          },
          get validationMessage() {
            return this.$state.validationMessage ?? ""
          },
          get willValidate() {
            return !this.$state.disabled && !this.hidden
          },
          checkValidity() {
            return this.willValidate ? !this.validationMessage : true
          },
          setCustomValidity(message: string) {
            this.$state.validationMessage = message
          },
          $state: {
            parents: ctx.parents ?? [],
            disabled: uiSchema.fieldset!.disabled ?? false,
          },
        },
  }) as LayoutField<P>

const createArrayField = <P extends object = object>(
  { items, name, fieldset = {}, ...uiSchema }: UIArraySchema<P>,
  ctx: TraversalContext<Field<P>>,
) =>
  assignProperties(
    createLayoutField(
      { ...uiSchema, fieldset, children: [] } as UILayoutSchema<P>,
      ctx,
    ),
    { name, items },
  ) as ArrayField<P>

const createControlField = <P extends object = object>(
  uiSchema: UIControlSchema<P>,
  ctx: TraversalContext<Field<P>>,
) =>
  ({
    parents: ctx.parents ?? [],
    hidden: uiSchema.hidden ?? false,
    required: uiSchema.required ?? false,
    defaultValue: "",
    value: "",
    get disabled() {
      return this.$state.disabled || someDisabled(this.parents)
    },
    set disabled(value) {
      this.$state.disabled = value
    },
    get name() {
      if (this.$state.parentArray) {
        const segments = [
          this.$state.parentArray.field.name,
          this.$state.parentArray.item.$state.index,
          this.$state.name,
        ]
        return segments.filter((x) => x !== "").join(".")
      }
      return this.$state.name
    },
    get validationMessage() {
      return this.$state.validationMessage ?? ""
    },
    get willValidate() {
      return !this.$state.disabled && !this.hidden
    },
    checkValidity() {
      return this.willValidate ? !this.validationMessage : true
    },
    setCustomValidity(message: string) {
      this.$state.validationMessage = message
    },
    $state: {
      name: uiSchema.name,
      disabled: uiSchema.disabled ?? false,
    },
  }) as ControlField<P>

export const createField = <P extends object = object>(uiSchema: UISchema<P>) =>
  createMutable(
    uiTree.map<UISchema<P>, Field<P>>((uiSchema, ctx) => {
      if (isArraySchema(uiSchema)) {
        return createArrayField(uiSchema, ctx)
      }
      if (isLayoutSchema(uiSchema)) {
        return createLayoutField(uiSchema, ctx)
      }
      if (isControlSchema(uiSchema)) {
        return createControlField(uiSchema, ctx)
      }
      throw new Error(
        'Invalid UI schema: "name", "children", or "items" is required',
      )
    }, uiSchema),
  )

// Better suited for a json schema -> ui schema util
// const Component =
//   (typeof control === "string" ? controls[control] : control) ??
//   controls[Array.isArray(schema.enum) ? "Select" : ""] ??
//   controls[`type.${schema.type}`] ??
//   controls["NotFound"]

// Better suited for a json schema -> ui schema util
// const Component =
//   (typeof layout === "string" ? layouts[layout] : layout) ??
//   layouts[field.parent === undefined ? "Form" : ""] ??
//   layouts[`type.${schema.type}`] ??
//   layouts["NotFound"]

// Better suited for a json schema -> ui schema util
// import { Field } from "@json-schema-forms/core"
// import { HTMLInputTypeAttribute } from "react"
//
// /**
//  * Input types that make sense for a form field
//  */
// type InputType = Exclude<
//   HTMLInputTypeAttribute,
//   | "button"
//   | "image"
//   | "reset"
//   | "submit"
//   // Superseded by `field.hidden`
//   | "hidden"
//   // This is some weird type union they've got :/
//   | object
// >
//
// export const getFieldInputType = (field: Field): InputType => {
//   const fromStringFormat: Record<string, InputType> = {
//     date: "date",
//     time: "time",
//     "date-time": "datetime-local",
//     email: "email",
//     "idn-email": "email",
//     uri: "url",
//     iri: "url",
//   }
//
//   if (
//     field.schema.type === "string" &&
//     field.schema.format !== undefined &&
//     field.schema.format in fromStringFormat
//   ) {
//     return fromStringFormat[field.schema.format]
//   }
//
//   if (
//     (field.schema.type === "number" || field.schema.type === "integer") &&
//     (field.schema.minimum ?? field.schema.exclusiveMinimum) !== undefine
