import { ReactNode, createContext } from "react"
import { ControlComponent, LayoutComponent } from "./types.js"

export type ContextType<P extends object> = {
  controls: Record<string, ControlComponent<P>>
  layouts: Record<string, LayoutComponent<P>>
}

export const Context = createContext<ContextType<any>>({
  layouts: {},
  controls: {},
})

export const Provider = <P extends object>({
  children,
  controls,
  layouts,
}: { children: ReactNode } & ContextType<P>) => (
  <Context.Provider value={{ controls, layouts }}>{children}</Context.Provider>
)
