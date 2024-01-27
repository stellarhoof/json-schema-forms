import { FormComponentsContextType } from "@json-schema-forms/react"

import Checkbox from "./layouts/Checkbox.js"
import Default from "./layouts/Default.js"
import Fieldset from "./layouts/Fieldset.js"
import Form from "./layouts/Form.js"
import NotFound from "./NotFound.js"

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
