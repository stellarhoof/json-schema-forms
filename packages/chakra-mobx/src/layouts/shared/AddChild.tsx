import { Omit } from "utility-types"
import { action } from "mobx"
import { observer } from "mobx-react-lite"
import { Button, ButtonProps, Icon } from "@chakra-ui/react"
import { MdAdd } from "react-icons/md/index.js"
import { ReactField } from "@json-schema-forms/react"
import { canAddChild, addChild } from "@json-schema-forms/core"

export default observer(
  <P extends object>({
    field,
    ...props
  }: { field: ReactField<P> } & Omit<ButtonProps, "children">) =>
    canAddChild(field) ? (
      <Button
        size="xs"
        leftIcon={<Icon as={MdAdd} boxSize="1.2em" />}
        onClick={action(() => addChild(field, 0))}
        {...props}
      >
        Add New {(field.schema as any).items.title}
      </Button>
    ) : null
)
