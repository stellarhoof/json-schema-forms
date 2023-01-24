import { ReactNode, ForwardedRef } from "react"
import { Field } from "@json-schema-form/core"

export type ReactField<P extends object> = Field<ReactFieldProps<P> & P>

export type ControlComponent<P extends object> = <Props extends object>(
  props: { field: ReactField<P> } & Props,
  ref: ForwardedRef<any>
) => ReactNode

export type LayoutComponent<P extends object> = ControlComponent<P>

export type ReactFieldProps<P extends object = object> = {
  control?: string | ControlComponent<P>
  layout?: string | LayoutComponent<P>
  controlProps?: Record<string, any>
  layoutProps?: Record<string, any>
}
