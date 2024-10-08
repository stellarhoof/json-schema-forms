import { Switch,SwitchProps } from "@chakra-ui/react"
import { ReactField } from "@json-schema-forms/react"
import { observer } from "mobx-react-lite"
import { ForwardedRef, forwardRef } from "react"

type Props<P extends object> = { field: ReactField<P> } & SwitchProps

export default observer(
  forwardRef(
    <P extends object>(
      { field, ...props }: Props<P>,
      ref: ForwardedRef<any>
    ) => (
      <Switch
        ref={ref}
        alignItems="baseline"
        value="true"
        isChecked={!!field.value}
        onChange={(e) => (field.value = e.target.checked ?? field.value)}
        {...props}
      />
    )
  )
)
