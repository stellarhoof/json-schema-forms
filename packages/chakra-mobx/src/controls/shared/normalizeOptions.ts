import toString from "lodash/toString.js"

type K = string | number | symbol

interface PlainObject {
  // Object.hasOwn() is intended as a replacement for Object.hasOwnProperty().
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
  hasOwn(key: K): this is Record<K, unknown>
  hasOwnProperty(key: K): this is Record<K, unknown>
  [k: K]: any
}

export const isPlainObject = (value: unknown): value is PlainObject =>
  !!value && typeof value === "object" && !Array.isArray(value)

export interface Option extends Record<string, any> {
  value: any
  label: React.ReactNode
}

export type ValueToLabelFn = (value: Option["value"]) => Option["label"]

export const normalizeOption = ({
  option,
  valueToLabel = toString,
}: {
  option: any
  valueToLabel?: ValueToLabelFn
}): Option => {
  if (isPlainObject(option)) {
    return {
      ...option,
      label: option.label ?? valueToLabel(option.value),
      value: option.value,
    }
  }
  return {
    label: valueToLabel(option),
    value: toString(option),
  }
}

export const normalizeOptions = ({
  options,
  valueToLabel,
}: {
  options?: any[]
  valueToLabel?: ValueToLabelFn
}) => (options ?? []).map((option) => normalizeOption({ option, valueToLabel }))
