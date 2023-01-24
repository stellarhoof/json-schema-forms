/**
 * @see https://json-schema.org/understanding-json-schema/reference/string.html#format
 * @see https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts
 */
export type StringFormat =
  /**
   * Date only
   * @example 2018-11-13
   */
  | "date"
  /**
   * Time only
   * @example 20:20:39+00:00
   */
  | "time"
  /**
   * Date and time together
   * @example 2018-11-13T20:20:39+00:00
   */
  | "date-time"
  /**
   * Internet email address
   * @see {@link https://www.rfc-editor.org/rfc/rfc5321#section-4.1.2}
   */
  | "email"
  /**
   * Internationalized Internet email address
   * @see {@link https://www.rfc-editor.org/rfc/rfc6531}
   */
  | "idn-email"
  /**
   * Internet host name
   * @see {@link https://datatracker.ietf.org/doc/html/rfc1123#section-2.1}
   */
  | "hostname"
  /**
   *  Internationalized Internet host name
   * @see {@link https://www.rfc-editor.org/rfc/rfc5890#section-2.3.2.3}
   */
  | "idn-hostname"
  /**
   * IPv4 address
   * @see {@link https://www.rfc-editor.org/rfc/rfc2673#section-3.2}
   */
  | "ipv4"
  /**
   * IPv6 address
   * @see {@link https://www.rfc-editor.org/rfc/rfc2373#section-2.2}
   */
  | "ipv6"
  /**
   * Universally Unique Identifier
   * @see {@link https://datatracker.ietf.org/doc/html/rfc4122}
   * @example 3e4666bf-d5e5-4aa7-b8ce-cefe41c7568a
   */
  | "uuid"
  /**
   * Universal resource identifier
   * @see {@link https://www.rfc-editor.org/rfc/rfc3986}
   */
  | "uri"
  /**
   * URI Reference (either a URI or a relative-reference)
   * @see {@link https://www.rfc-editor.org/rfc/rfc3986#section-4.1}
   */
  | "uri-reference"
  /**
   * Internationalized URI
   * @see {@link https://www.rfc-editor.org/rfc/rfc3987}
   */
  | "iri"
  /**
   * Internationalized URI Reference
   * @see {@link https://www.rfc-editor.org/rfc/rfc3987}
   */
  | "iri-reference"
  /**
   * A URI Template (of any level). If you don’t already know what a URI
   * Template is, you probably don’t need this value.
   * @see {@link https://www.rfc-editor.org/rfc/rfc6570}
   */
  | "uri-template"
  /**
   * JSON Pointer
   * @see {@link https://www.rfc-editor.org/rfc/rfc6901}
   * @example #/foo/bar
   */
  | "json-pointer"
  /**
   * Relative JSON Pointer
   * @see {@link https://datatracker.ietf.org/doc/html/draft-handrews-relative-json-pointer-01}
   */
  | "relative-json-pointer"
  /**
   * A regular expression
   * @see {@link https://www.ecma-international.org/publications-and-standards/standards/ecma-262/}
   */
  | "regex"
  | string

interface BaseJsonSchema<T> {
  title?: string
  description?: string
  readOnly?: boolean
  writeOnly?: boolean
  default?: T
  const?: T
  enum?: T[]
}

export type BooleanJsonSchema<T extends object = object> =
  BaseJsonSchema<boolean> & {
    readonly type: "boolean"
  } & T

export type IntegerJsonSchema<T extends object = object> =
  BaseJsonSchema<number> & {
    readonly type: "integer"
    multipleOf?: number
    minimum?: number
    exclusiveMinimum?: number
    maximum?: number
    exclusiveMaximum?: number
  } & T

export type NumberJsonSchema<T extends object = object> =
  BaseJsonSchema<number> & {
    readonly type: "number"
    multipleOf?: number
    minimum?: number
    exclusiveMinimum?: number
    maximum?: number
    exclusiveMaximum?: number
  } & T

export type StringJsonSchema<T extends object = object> =
  BaseJsonSchema<string> & {
    readonly type: "string"
    pattern?: string
    minLength?: number
    maxLength?: number
    format?: StringFormat
  } & T

export type ArrayJsonSchema<T extends object = object> = BaseJsonSchema<
  Array<any>
> & {
  readonly type: "array"
  items: JsonSchema<T>
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
} & T

export type ObjectJsonSchema<T extends object = object> = BaseJsonSchema<
  Record<any, any>
> & {
  readonly type: "object"
  required?: string[]
  properties?: Record<string, JsonSchema<T>>
  additionalProperties?: boolean
  minProperties?: number
  maxProperties?: number
} & T

export type JsonSchema<T extends object = object> =
  | BooleanJsonSchema<T>
  | NumberJsonSchema<T>
  | IntegerJsonSchema<T>
  | StringJsonSchema<T>
  | ArrayJsonSchema<T>
  | ObjectJsonSchema<T>
