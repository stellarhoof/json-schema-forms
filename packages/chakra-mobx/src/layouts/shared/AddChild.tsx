import { Omit } from "utility-types"
import { observer } from "mobx-react-lite"
import { Button, ButtonProps, Icon } from "@chakra-ui/react"
import { MdAdd } from "react-icons/md/index.js"

export default observer(
  ({ field, ...props }: { field: any } & Omit<ButtonProps, "children">) =>
    field.canAddChild ? (
      <Button
        size="xs"
        leftIcon={<Icon as={MdAdd} boxSize="1.2em" />}
        onClick={() => field.addChild(0)}
        {...props}
      >
        Add New {field.schema.items.title}
      </Button>
    ) : null
)
