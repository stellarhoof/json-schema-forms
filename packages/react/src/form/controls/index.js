import _ from "lodash/fp.js"
import {
  Enum,
  Number,
  String,
  Boolean,
  Array,
  Object,
} from "./JSONSchemaTypes.jsx"

const controls = {
  enum: Enum,
  number: Number,
  string: String,
  boolean: Boolean,
  array: Array,
  object: Object,
}

export const getSchemaControl = (schema) =>
  controls[(_.isArray(schema.enum) && "enum") || schema.type]
