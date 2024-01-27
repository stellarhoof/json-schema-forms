import { Button, ButtonProps } from "@chakra-ui/react"
import { ReactField } from "@json-schema-forms/react"
import { observer } from "mobx-react-lite"

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
