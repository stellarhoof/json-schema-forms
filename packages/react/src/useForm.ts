import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  FormEvent,
} from "react"

export default (
  submitFn?: (e: FormEvent<HTMLFormElement>) => void | Promise<void>
) => {
  const ref = useRef<HTMLFormElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      setIsSubmitting(true)
      try {
        await submitFn?.(e)
      } finally {
        setIsSubmitting(false)
      }
    },
    [submitFn]
  )

  const onInvalid = useCallback((e: FormEvent<HTMLElement>) => {
    const node = e.target as HTMLElement
    node.focus()
  }, [])

  useLayoutEffect(() => {
    const form = ref.current
    if (form) {
      form.style.pointerEvents = isSubmitting ? "none" : "initial"
      if (form.noValidate && !isSubmitting) {
        form
          .querySelector('[aria-invalid]:not([aria-invalid="false"])')
          ?.dispatchEvent(new Event("invalid"))
      }
    }
  }, [isSubmitting])

  return {
    ref,
    onSubmit,
    onInvalid,
    noValidate: true,
  }
}
