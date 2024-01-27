import type * as Core from "@json-schema-forms/core"
import { createContext, ForwardedRef, ReactNode } from "react"

type Props = Record<string, any>

export type ReactLayoutComponent = <Props extends object>(
  props: { field: ReactLayoutField } & Props,
  ref: ForwardedRef<any>,
) => ReactNode

export type ReactLayoutField = Core.LayoutField<{
  component?: ReactLayoutComponent
  props?: Props
}>

export type ReactArrayComponent = <Props extends object>(
  props: { field: ReactArrayField } & Props,
  ref: ForwardedRef<any>,
) => ReactNode

export type ReactArrayField = Core.ArrayField<{
  component?: ReactArrayComponent
  props?: Props
}>

export type ReactControlComponent = <Props extends object>(
  props: { field: ReactControlField } & Props,
  ref: ForwardedRef<any>,
) => ReactNode

export type ReactControlField = Core.ControlField<{
  component?: ReactControlComponent
  props?: Props
}>

export type ReactField = ReactLayoutField | ReactArrayField | ReactControlField

export type ContextType = {
  notFound: <Props extends object>(
    props: { field: ReactField } & Props,
    ref: ForwardedRef<any>,
  ) => ReactNode
  controls: Record<string, ReactControlComponent>
  layouts: Record<string, ReactLayoutComponent>
  arrays: Record<string, ReactArrayComponent>
}

export const Context = createContext<ContextType>({
  notFound: () => "Component not found",
  layouts: {},
  controls: {},
  arrays: {},
})

export const Provider = ({
  children,
  ...props
}: { children: ReactNode } & ContextType) => (
  <Context.Provider value={props}>{children}</Context.Provider>
)
