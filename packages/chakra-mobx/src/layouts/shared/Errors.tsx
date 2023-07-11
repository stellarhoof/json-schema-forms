import upperFirst from "lodash/upperFirst.js"
import { observer } from "mobx-react-lite"
import {
  Box,
  BoxProps,
  FormErrorMessage,
  FormErrorIcon,
} from "@chakra-ui/react"
import { ReactField } from "@json-schema-forms/react"

type Props<P extends object> = { field: ReactField<P> } & BoxProps

export default observer(<P extends object>({ field, ...props }: Props<P>) =>
  field.validationMessage ? (
    <Box {...props}>
      {field.validationMessage?.split("\n").map((message) => (
        <FormErrorMessage key={message}>
          <FormErrorIcon />
          {upperFirst(message)}
        </FormErrorMessage>
      ))}
    </Box>
  ) : null
)
