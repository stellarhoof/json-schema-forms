import { FormComponentsContextType } from "@json-schema-forms/react"
import NotFound from "./NotFound.js"
import Default from "./layouts/Default.js"
import Form from "./layouts/Form.js"
import Fieldset from "./layouts/Fieldset.js"
import Checkbox from "./layouts/Checkbox.js"

export default {
  "type.string": Default,
  "type.number": Default,
  "type.boolean": Checkbox,
  "type.array": Fieldset,
  "type.object": Fieldset,
  NotFound,
  Default,
  Form,
  Fieldset,
  Checkbox,
} as FormComponentsContextType<any>["layouts"]
