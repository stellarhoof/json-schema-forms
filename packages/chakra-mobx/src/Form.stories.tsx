import { Center, chakra } from "@chakra-ui/react"
import { createForm,FormSchema } from "@json-schema-forms/core"
import { Field, ReactFieldProps,useForm } from "@json-schema-forms/react"
import { validate } from "@json-schema-forms/validator-ajv"
import { ErrorObject } from "ajv"
import startCase from "lodash/fp/startCase.js"
import { observable, reaction } from "mobx"
import { useState } from "react"

import Submit from "./Submit.js"

const meta = {
  title: "Form",
}

export default meta

const schema: FormSchema<ReactFieldProps> = {
  type: "object",
  title: "Form",
  description: "People and animals all live in harmony",
  onCreateField: (field) => {
    field.controlProps = { gap: 6, gridAutoFlow: "column", alignItems: "start" }
  },
  properties: {
    scalarArray: {
      type: "array",
      items: {
        type: "string",
      },
    },
    arr: {
      type: "array",
      items: {
        type: "object",
        required: ["name"],
        title: "Person",
        onCreateField: (field) => {
          // Make form dirty
          field.value.isMarried = !field.value.isMarried
          return reaction(
            () => field.value.age,
            (age) => {
              field.value.isMarried = age > 20
            }
          )
        },
        properties: {
          name: {
            type: "string",
            description: "Full name of the person in question",
          },
          age: {
            type: "number",
            minimum: 10,
          },
          isMarried: {
            type: "boolean",
            description: "Did you in fact get married?",
          },
          job: {
            type: "string",
            enum: ["Analyst", "Courier", "Singer", "Mercenary"],
            readOnly: true,
          },
        },
      },
    },
  },
}

const defaultValue = {
  scalarArray: ["Pocahontas", "Snow White"],
  arr: [{ job: "Mercenary", age: 22, isMarried: true }],
}

const form = createForm(schema, {
  defaultValue,
  createStore: observable,
  onCreateField(field) {
    field.controlProps ??= {}
    field.layoutProps ??= {}
    if (
      field.schema.title === undefined &&
      field.key !== undefined &&
      typeof field.key !== "number"
    ) {
      field.schema.title = startCase(field.key)
    }
  },
})

const serverCall = (formData: FormData) =>
  new Promise<ErrorObject[]>((resolve) => {
    setTimeout(() => {
      const errors = formData.get("arr.0.isMarried")
        ? [
            {
              instancePath: "/arr/0/isMarried",
              schemaPath: "#/properties/arr/items/properties/isMarried/custom",
              keyword: "custom",
              params: {},
              message: "server says: cannot be married",
              schema: ["isMarried"],
            },
          ]
        : []
      resolve(errors)
    }, 1000)
  })

export const Form = {
  render: () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const props = useForm(async (e) => {
      e.preventDefault()
      setIsSubmitting(true)
      if (validate(form)) {
        const errors = await serverCall(new FormData(e.currentTarget))
        if (validate(form, { errors })) {
          form.clean() // Or field.reset()
        }
      }
      setIsSubmitting(false)
    })
    return (
      <Center>
        <chakra.form
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8",
            alignItems: "end",
            "[data-dirty] >": {
              "label, legend": {
                ".title": {
                  color: "red.600",
                  "::after": {
                    content: '" (Dirty)"',
                  },
                },
              },
            },
          }}
          {...props}
        >
          <Field field={form} />
          <Submit field={form} colorScheme="blue" isLoading={isSubmitting} />
        </chakra.form>
      </Center>
    )
  },
}
