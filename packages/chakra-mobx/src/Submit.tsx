import { observer } from "mobx-react-lite"
import { Button, ButtonProps } from "@chakra-ui/react"
import { ReactField } from "@json-schema-form/react"

type Props<P extends object> = { field: ReactField<P> } & ButtonProps

export default observer(
  <P extends object>({ field, children = "Submit", ...props }: Props<P>) => (
    <Button
      type="submit"
      loadingText="Saving..."
      isDisabled={!field.dirty || field.disabled}
      {...props}
    >
      {children}
    </Button>
  )
)
