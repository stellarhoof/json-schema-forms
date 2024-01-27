import { Button, ButtonProps, Icon } from "@chakra-ui/react"
import { addChild,canAddChild } from "@json-schema-forms/core"
import { ReactField } from "@json-schema-forms/react"
import { action } from "mobx"
import { observer } from "mobx-react-lite"
import { MdAdd } from "react-icons/md/index.js"
import { Omit } from "utility-types"

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
