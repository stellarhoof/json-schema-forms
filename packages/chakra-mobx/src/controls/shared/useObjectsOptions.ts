import { useMemo, ChangeEvent } from "react"
import stringify from "safe-stable-stringify"
import { Option, normalizeOption } from "./normalizeOptions.js"

type Document = Record<string, any>

interface ObjectOption<T extends Document> extends Document {
  value: T
  label: React.ReactNode
}

type Props<T extends Document> = {
  value: T
  options: ObjectOption<T>[]
  valueToLabel?: Parameters<typeof normalizeOption>[0]["valueToLabel"]
}

export function useObjectsOptions<T extends Document>({
  value,
  options,
  valueToLabel,
}: Props<T>) {
  const cached = useMemo<Option[]>(
    () =>
      options.map((option) =>
        normalizeOption({
          option: { ...option, value: stringify(option.value) },
          valueToLabel,
        })
      ),
    [options.length]
  )
  return {
    value: stringify(value) ?? "",
    options: cached,
    onChange: (e: ChangeEvent<HTMLSelectElement> | string): T =>
      JSON.parse(typeof e === "string" ? e : e.target.value),
  }
}
