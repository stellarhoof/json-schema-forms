import { Omit } from "utility-types"
import { observer } from "mobx-react-lite"
import { Icon, Button, ButtonProps } from "@chakra-ui/react"
import { MdDelete } from "react-icons/md/index.js"
import { ReactField } from "@json-schema-forms/react"

export default observer(
  <P extends object>({
    field,
    ...props
  }: { field: ReactField<P> } & Omit<ButtonProps, "children">) =>
    field.parent?.canRemoveChild ? (
      <Button
        size="xs"
        leftIcon={<Icon as={MdDelete} boxSize="1.2em" />}
        onClick={() => field.parent!.removeChild(field.key as number)}
        {...props}
      >
        Remove
      </Button>
    ) : null
)
