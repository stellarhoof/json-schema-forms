import { FormComponentsContextType } from "@json-schema-form/react"
import Checkbox from "./controls/Checkbox.js"
import ChildrenGrid from "./controls/ChildrenGrid.js"
import Input from "./controls/Input.js"
import NumberInput from "./controls/NumberInput.js"
import Select from "./controls/Select.js"
import RadioGroup from "./controls/RadioGroup.js"
import Slider from "./controls/Slider.js"
import Switch from "./controls/Switch.js"
import Textarea from "./controls/Textarea.js"
import NotFound from "./NotFound.js"

export default {
  "type.string": Input,
  "type.number": NumberInput,
  "type.boolean": Checkbox,
  "type.array": ChildrenGrid,
  "type.object": ChildrenGrid,
  NotFound,
  Input,
  Select,
  Checkbox,
  NumberInput,
  ChildrenGrid,
  RadioGroup,
  Slider,
  Switch,
  Textarea,
} as FormComponentsContextType<any>["controls"]
