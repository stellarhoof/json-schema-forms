import _ from "lodash/fp.js"
import get from "lodash/get.js"
import set from "lodash/set.js"
import { Required } from "utility-types"
import { Collection, Tree } from "@json-schema-forms/tree-utils"
import {
  JsonSchema,
  getChildrenSchemasFromValue,
} from "@json-schema-forms/json-schema-utils"
import { formTree } from "./util.js"
import { FieldId, FormConfig } from "./createForm.js"

export type Field<P extends object = object> = P & {
  /**
   * Property name in an object schema or index in an array schema
   */
  key?: string | number

  /**
   * Schema this field belongs to
   */
  readonly schema: JsonSchema

  /**
   * Field keys starting from the root field
   *
   * Root node has empty name
   */
  readonly name: string

  /**
   * Parent field
   */
  readonly parent: Field<P> | undefined

  /**
   * Children fields
   */
  children: Collection<Field<P>> | undefined

  /**
   * This field's value
   */
  value: any

  /**
   * This field's default value
   */
  defaultValue: any

  /**
   * Mark all fields as clean (not dirty)
   */
  clean: () => void

  /**
   * Reset field value to its default value
   */
  reset: () => void

  /**
   * Whether this field's value has changed from its default value
   */
  dirty: boolean

  /**
   * If set, this field will not participate in validation (`willValidate` will be `false`).
   *
   * The `disabled` state is inherited by all fields nested under this one.
   * The `disabled` state should "stack", e.g. if two parents are
   * `disabled`, only by clearing them both can this field be enabled again
   * (assumming this field itself is not `disabled`).
   *
   * Also, the UI control displaying this field should ensure `disabled` is set
   * on the underlying control element to prevent it from being submitted.
   *
   * @see {@link "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled"}
   */
  disabled: boolean

  /**
   * Equivalent to the {@link "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/hidden" hidden} HTML attribute on an input element. Setting `hidden` excludes this field from validation.
   */
  hidden: boolean

  /**
   * `true` if the parent schema has `type: object` and its `required` property includes this field's `name`
   */
  readonly required: boolean

  /**
   * @see {@link "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-willvalidate"}
   */
  readonly willValidate: boolean

  /**
   * @see {@link "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-setcustomvalidity"}
   */
  setCustomValidity: (message: string) => void

  /**
   * @see {@link "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-checkvalidity"}
   */
  checkValidity: () => boolean

  /**
   * @see {@link "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-validationmessage"}
   */
  readonly validationMessage: string

  dispose: () => void

  /** @private */
  readonly id: FieldId
  /** @private */
  readonly context: any
  /** @private */
  readonly __state__: any
}

export interface Context<P extends object> {
  /**
   * A map of FieldId -> ResultField that holds all the fields in the form.
   *
   * This is necessary because a field contains references to other fields
   * (including itself) and `createStore` may return new fields, making such
   * references stale.
   *
   * The following snippet illustrates the problem:
   *
   * ```javascript
   * const createField = (parent) => {
   *   const field = {
   *     get self() { return field },
   *     get parent() { return parent },
   *   }
   *   return field
   * }
   *
   * const parent = createStore(createField()) // `parent.self` is stale now
   * const field = createStore(createField(parent)) // `field.self` is stale now
   * ```
   *
   * Now a snippet that illustrates how `fieldMap` solves the problem:
   *
   * ```javascript
   * const fieldMap = new Map()
   *
   * const createField = (parentId, selfId) => ({
   *   get self() { return fieldMap.get(selfId) },
   *   get parent() { return fieldMap.get(parentId) },
   * })
   *
   * const parentId = Symbol()
   * fieldMap.set(parentId, createStore(createField(null, parentId)))
   *
   * const selfId = Symbol()
   * fieldMap.set(selfId, createStore(createField(parentId, selfId)))
   * ```
   */
  fieldMap: Map<FieldId, Field<P>>
  createStore: <T>(value: T) => T
  store: { value: any; defaultValue: any }
  onCreateField: Required<FormConfig<P>>["onCreateField"]
}

interface CreateFieldProps<P extends object> {
  id: FieldId
  parentId?: FieldId
  key?: string | number
  jsonSchema: JsonSchema
  context: Context<P>
}

export const createField = <P extends object>({
  id,
  key,
  parentId,
  jsonSchema,
  context,
}: CreateFieldProps<P>) => {
  const field = new Tree<any>({
    getChildren: getChildrenSchemasFromValue(
      key ? context.fieldMap.get(parentId!)!.value[key] : context.store.value
    ),
    setChildren: (field, children) => {
      field.children = children
      return field
    },
  }).map<JsonSchema, Field>((jsonSchema, ctx) => {
    const field = _createField({
      id: ctx.key === undefined ? id : Symbol(),
      key: ctx.key ?? key,
      parentId: _.head(ctx.parents)?.id ?? parentId,
      jsonSchema,
      context,
    })
    context.fieldMap.set(field.id, field as Field<P>)
    return field
  }, jsonSchema)

  formTree.forEach(
    {
      post: (field) => {
        const store = context.createStore(field)
        context.fieldMap.set(field.id, store)
        context.onCreateField(store)
      },
    },
    field as Field<P>
  )

  return context.fieldMap.get(field.id)!
}

const _createField = <P extends object>({
  id,
  key,
  parentId,
  jsonSchema,
  context,
}: CreateFieldProps<P>): Field => {
  const getSelf = () => context.fieldMap.get(id)!

  const field = {
    // Common properties
    key,
    get schema() {
      return jsonSchema
    },
    get parent() {
      return parentId ? context.fieldMap.get(parentId)! : undefined
    },
    get children() {
      const self = getSelf()
      const children = (self.__state__.childrenIds as FieldId[])?.map(
        (id) => context.fieldMap.get(id)!
      )
      if (self.schema.type === "array") {
        return children
      }
      if (self.schema.type === "object") {
        return Object.fromEntries(children.map((field) => [field.key, field]))
      }
    },
    set children(children: Collection<Field<P>> | undefined) {
      if (children) {
        getSelf().__state__.childrenIds = Object.values(children).map(
          (field) => {
            context.fieldMap.set(field.id, field)
            return field.id
          }
        )
      }
    },

    // Form HTMLElement properties

    // Should we make this a json schema path like `#/properties/foo/properties/bar`?
    get name() {
      const self = getSelf()
      if (self.key === undefined) {
        return ""
      }
      if (self.parent?.key === undefined) {
        return self.key
      }
      return `${self.parent.name}.${self.key}`
    },
    get disabled() {
      return getSelf().parent?.disabled || getSelf().__state__.disabled
    },
    set disabled(value) {
      getSelf().__state__.disabled = value
    },
    get hidden() {
      return getSelf().__state__.hidden
    },
    set hidden(value) {
      getSelf().__state__.hidden = value
    },

    // Value properties

    get value() {
      const self = getSelf()
      if (self.name) {
        return get(context.store.value, self.name)
      } else {
        return context.store.value
      }
    },
    set value(value) {
      const self = getSelf()
      if (self.name) {
        set(context.store.value, self.name, value)
      } else {
        context.store.value = value
      }
    },
    get defaultValue() {
      const self = getSelf()
      if (self.name) {
        return get(context.store.defaultValue, self.name)
      } else {
        return context.store.defaultValue
      }
    },
    set defaultValue(value) {
      const self = getSelf()
      if (self.name) {
        set(context.store.defaultValue, self.name, value)
      } else {
        context.store.defaultValue = value
      }
    },
    clean() {
      const self = getSelf()
      self.defaultValue = _.cloneDeep(self.value)
    },
    reset() {
      const self = getSelf()
      self.value = _.cloneDeep(self.defaultValue)
    },
    get dirty() {
      const self = getSelf()
      if (self.children) {
        return _.some("dirty", Object.values(self.children))
      }
      return !_.isEqual(self.value ?? "", self.defaultValue ?? "")
    },
    get required() {
      const self = getSelf()
      if (self.willValidate && self.parent?.schema.type === "object") {
        return (self.parent.schema.required ?? []).includes(self.key as string)
      }
      return false
    },

    // Constraint validation properties

    // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraint-validation
    // Normally the constraint validation spec specifies that fields be are
    // checked one by one, however a JSON schema can define relationships
    // between fields, making the constraint validation spec unsuitable. The
    // root field needs to be validated as a whole instead.
    get willValidate() {
      const self = getSelf()
      return !self.__state__.hidden && !self.__state__.disabled
    },
    setCustomValidity(message: string) {
      getSelf().__state__.validationMessage = message
    },
    checkValidity() {
      const self = getSelf()
      if (self.willValidate) {
        // Browsers can determine if a field satisfies validation constraints
        // and return an appropriate value from this method. We can't do that
        // (validation is run externally to this library) so we have to make the
        // assumption that a validation message means the field is invalid.
        return !self.__state__.validationMessage
      }
      return true
    },
    get validationMessage() {
      const self = getSelf()
      return self.checkValidity() ? "" : self.__state__.validationMessage
    },

    // Utilities

    dispose() {
      formTree.forEach(
        { post: (field) => field.__state__.dispose?.() },
        getSelf()
      )
    },

    // Internal

    __state__: {
      disabled: !!jsonSchema.readOnly,
      childrenIds: [],
    },
  } as Field

  // Hack so utils outside of this function can access these values but
  // they're not writable or enumerable.
  Object.defineProperties(field, {
    id: {
      get() {
        return id
      },
    },
    context: {
      get() {
        return context
      },
    },
  })

  return field
}
