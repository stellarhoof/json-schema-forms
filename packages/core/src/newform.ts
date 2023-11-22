import { createMutable } from "solid-js/store"
import { TraversalContext, Tree } from "@json-schema-forms/tree-utils"
import { Assign } from "utility-types"

// TODO: Util to get value for all controls under field. A tree reduce on
// [name, value] pairs for controls. Pay special attention to array fields.
// Should we make `name` a getter?
// Q: How do value/defaultValue get assigned?

const assignProperties = <L extends object, R extends object>(
  left: L,
  right: R,
) => {
  Object.defineProperties(left, Object.getOwnPropertyDescriptors(right))
  return left as Assign<L, R>
}

const isControlSchema = (
  x: any,
): x is typeof x extends UISchema ? UIControlSchema : ControlField =>
  "name" in x && x.name !== undefined

const isLayoutSchema = (
  x: any,
): x is typeof x extends UISchema ? UILayoutSchema : LayoutField =>
  "children" in x && x.children !== undefined

const isArraySchema = (
  x: any,
): x is typeof x extends UISchema ? UIArraySchema : ArrayField =>
  "name" in x && x.name !== undefined && "items" in x && x.items !== undefined

const hasFieldset = (
  x: any,
): x is typeof x extends UISchema ? UILayoutSchema : LayoutField =>
  "fieldset" in x && x.fieldset !== undefined

const someDisabled = (fields: Field[]) =>
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

export const $state = Symbol("field-state")

type Props = Record<string, any>

type Component = string | (() => void)

export interface UILayoutSchema {
  children: UISchema[]
  component?: Component
  props?: Props
  fieldset?: {
    component?: Component
    props?: Props
    hidden?: boolean
    disabled?: boolean
  }
}

export interface UIArraySchema extends Omit<UILayoutSchema, "children"> {
  name: string
  items: UISchema
}

export interface UIControlSchema {
  name: string
  component?: Component
  props?: Props
  hidden?: boolean
  disabled?: boolean
  required?: boolean
}

export type UISchema = UILayoutSchema | UIArraySchema | UIControlSchema

interface ValidationProps {
  willValidate: boolean
  validationMessage: string
  checkValidity: () => boolean
  setCustomValidity: (message: string) => void
}

const createValidationProps = (): ValidationProps => ({
  get validationMessage() {
    return (this as any)[$state].validationMessage ?? ""
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
  component?: Component
  props?: Props
  hidden: boolean
  disabled: boolean
}

export interface LayoutField {
  component?: Component
  props?: Props
  parents: Field[]
  children: Field[]
  fieldset?: FieldsetProps
}

const createLayoutField = (
  uiSchema: UILayoutSchema,
  ctx: TraversalContext<Field>,
): LayoutField => {
  const field = {
    component: uiSchema.component,
    props: uiSchema.props,
    parents: ctx.parents ?? [],
    children: [],
  } as LayoutField
  if (hasFieldset(uiSchema)) {
    field.fieldset = assignProperties(
      {
        component: uiSchema.component,
        props: uiSchema.props,
        hidden: uiSchema.fieldset!.hidden ?? false,
        get disabled() {
          return this[$state].disabled || someDisabled(this[$state].parents)
        },
        set disabled(value) {
          this[$state].disabled = value
        },
        [$state]: {
          parents: ctx.parents ?? [],
          disabled: uiSchema.fieldset!.disabled ?? false,
        } as any,
      },
      createValidationProps(),
    )
  }
  return field
}

export interface ArrayField extends LayoutField {
  name: string
  items: UISchema
}

const createArrayField = (
  { items, name, fieldset = {}, ...uiSchema }: UIArraySchema,
  ctx: TraversalContext<Field>,
): ArrayField =>
  assignProperties(
    createLayoutField({ ...uiSchema, fieldset, children: [] }, ctx),
    { name, items },
  )

export interface ControlField extends ValidationProps {
  component?: Component
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
  uiSchema: UIControlSchema,
  ctx: TraversalContext<Field>,
): ControlField =>
  assignProperties(
    {
      component: uiSchema.component,
      props: uiSchema.props,
      parents: ctx.parents ?? [],
      hidden: uiSchema.hidden ?? false,
      required: uiSchema.required ?? false,
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
        name: uiSchema.name,
        disabled: uiSchema.disabled ?? false,
      } as any,
    },
    createValidationProps(),
  )

export type Field = LayoutField | ArrayField | ControlField

export const createField = (uiSchema: UISchema) =>
  createMutable(
    uiTree.map<UISchema, Field>((uiSchema, ctx) => {
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

export const setControlsValues = (field: Field, value: any) =>
  uiTree.forEach((field) => {
    console.log(field, value)
  }, field)
