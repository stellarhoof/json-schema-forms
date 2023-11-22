import { createMutable } from "solid-js/store"
import { TraversalContext, Tree } from "@json-schema-forms/tree-utils"
import { Assign } from "utility-types"

// TODO: Util to get value for all controls under field. A tree reduce on
// [name, value] pairs for controls. Pay special attention to array fields.
// Should we make `name` a getter?

const assign = <L extends object, R extends object>(left: L, right: R) => {
  Object.defineProperties(left, Object.getOwnPropertyDescriptors(right))
  return left as Assign<L, R>
}

const isControl = (
  x: any
): x is typeof x extends Schema ? ControlSchema : ControlField =>
  "name" in x && x.name !== undefined

const isLayout = (
  x: any
): x is typeof x extends Schema ? LayoutSchema : LayoutField =>
  "children" in x && x.children !== undefined

const isArray = (
  x: any
): x is typeof x extends Schema ? ArraySchema : ArrayField =>
  "name" in x && x.name !== undefined && "items" in x && x.items !== undefined

const hasFieldset = (
  x: any
): x is typeof x extends Schema ? LayoutSchema : LayoutField =>
  "fieldset" in x && x.fieldset !== undefined

const someDisabled = (fields: Field[]) =>
  fields.some(
    (x) =>
      ("disabled" in x && x.disabled) ||
      ("fieldset" in x && x.fieldset!.disabled)
  )

const uitree = new Tree<any>({
  getChildren(schema) {
    return schema.children
  },
  setChildren(schema, children) {
    schema.children = children
    return schema
  },
})

const $state = Symbol("field-state")

type Props = Record<string, any>

type Component = string | (() => void)

export interface LayoutSchema {
  children: Schema[]
  as?: Component
  props?: Props
  fieldset?: {
    as?: Component
    props?: Props
    hidden?: boolean
    disabled?: boolean
  }
}

export interface ArraySchema extends Omit<LayoutSchema, "children"> {
  name: string
  items: Schema
}

export interface ControlSchema {
  name: string
  as?: Component
  props?: Props
  hidden?: boolean
  disabled?: boolean
  required?: boolean
}

type Schema = LayoutSchema | ArraySchema | ControlSchema

interface ValidationProps {
  willValidate: boolean
  validationMessage: string
  checkValidity: () => boolean
  setCustomValidity: (message: string) => void
}

const createValidationProps = (): ValidationProps => ({
  get validationMessage() {
    return (this as any)[$state].validationMessage
  },
  get willValidate() {
    return !(this as any)[$state].disabled && !(this as any).hidden
  },
  checkValidity() {
    return this.willValidate ? !this.validationMessage : true
  },
  setCustomValidity(message: string) {
    // @ts-ignore
    this[$state].validationMessage = message
  },
})

export interface FieldsetProps extends ValidationProps {
  as?: Component
  props?: Props
  hidden: boolean
  disabled: boolean
}

export interface LayoutField {
  as?: Component
  props?: Props
  parents: Field[]
  children: Field[]
  fieldset?: FieldsetProps
}

const createLayoutField = (
  schema: LayoutSchema,
  ctx: TraversalContext<Field>
): LayoutField => {
  const field = {
    as: schema.as,
    props: schema.props,
    parents: ctx.parents ?? [],
    children: [],
  } as LayoutField
  if (hasFieldset(schema)) {
    field.fieldset = assign(
      {
        as: schema.as,
        props: schema.props,
        hidden: schema.fieldset!.hidden ?? false,
        get disabled() {
          return this[$state].disabled || someDisabled(this[$state].parents)
        },
        set disabled(value) {
          this[$state].disabled = value
        },
        [$state]: {
          parents: ctx.parents ?? [],
          disabled: schema.fieldset!.disabled ?? false,
        } as any,
      },
      createValidationProps()
    )
  }
  return field
}

export interface ArrayField extends LayoutField {
  name: string
  items: Schema
}

const createArrayField = (
  { items, name, fieldset = {}, ...schema }: ArraySchema,
  ctx: TraversalContext<Field>
): ArrayField =>
  assign(createLayoutField({ ...schema, fieldset, children: [] }, ctx), {
    name,
    items,
  })

export interface ControlField extends ValidationProps {
  as?: Component
  props?: Props
  parents: Field[]
  name: string
  hidden: boolean
  disabled: boolean
  required: boolean
  defaultValue: any
  value: any
}

const createControlField = (
  schema: ControlSchema,
  ctx: TraversalContext<Field>
): ControlField =>
  assign(
    {
      as: schema.as,
      props: schema.props,
      parents: ctx.parents ?? [],
      hidden: schema.hidden ?? false,
      required: schema.required ?? false,
      defaultValue: "",
      value: "",
      get disabled() {
        return this[$state].disabled || someDisabled(this.parents)
      },
      set disabled(value) {
        this[$state].disabled = value
      },
      get name() {
        if (this[$state].parentArray) {
          const segments = [
            this[$state].parentArray.field.name,
            this[$state].parentArray.item[$state].index,
            this[$state].name,
          ]
          return segments.filter((x) => x !== "").join(".")
        }
        return this[$state].name
      },
      [$state]: {
        name: schema.name,
        disabled: schema.disabled ?? false,
      } as any,
    },
    createValidationProps()
  )

export type Field = LayoutField | ArrayField | ControlField

export const createField = (schema: Schema) =>
  createMutable(
    uitree.map<Schema, Field>((schema, ctx) => {
      if (isControl(schema)) {
        return createControlField(schema, ctx)
      }
      if (isLayout(schema)) {
        return createLayoutField(schema, ctx)
      }
      if (isArray(schema)) {
        return createArrayField(schema, ctx)
      }
      throw new Error(
        'Invalid schema: "name", "children", or "items" is required'
      )
    }, schema)
  )

export const setControlsValues = (field: Field, value: any) =>
  uitree.forEach((field) => {
    console.log(field, value)
  }, field)
