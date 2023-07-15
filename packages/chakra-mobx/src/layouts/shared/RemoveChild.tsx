import { Omit } from "utility-types"
import { action } from "mobx"
import { observer } from "mobx-react-lite"
import { Icon, Button, ButtonProps } from "@chakra-ui/react"
import { MdDelete } from "react-icons/md/index.js"
import { canRemoveChild, removeChild } from "@json-schema-forms/core"
import { ReactField } from "@json-schema-forms/react"

export default observer(
  <P extends object>({
    field,
    ...props
  }: { field: ReactField<P> } & Omit<ButtonProps, "children">) =>
    canRemoveChild(field.parent) ? (
      <Button
        size="xs"
        leftIcon={<Icon as={MdDelete} boxSize="1.2em" />}
        onClick={action(() => removeChild(field.parent!, field.key as number))}
        {...props}
      >
        Remove
      </Button>
    ) : null
)
