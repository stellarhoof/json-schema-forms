import { Button, ButtonProps,Icon } from "@chakra-ui/react"
import { canRemoveChild, removeChild } from "@json-schema-forms/core"
import { ReactField } from "@json-schema-forms/react"
import { action } from "mobx"
import { observer } from "mobx-react-lite"
import { MdDelete } from "react-icons/md/index.js"
import { Omit } from "utility-types"

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
