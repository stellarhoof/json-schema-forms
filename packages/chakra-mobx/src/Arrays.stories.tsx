import { observable } from "mobx"
import { createForm } from "@json-schema-form/core"
import { Field, ReactField, ReactFieldProps } from "@json-schema-form/react"

const meta = {
  title: "Arrays",
}

export default meta

const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit"

const onCreateField = (field: ReactField<object>) => {
  if (!field.parent) {
    field.controlProps = {
      display: "flex",
      gap: 4,
      alignItems: "start",
    }
  }
}

export const ArraysOfPrimitives = {
  render: () => {
    const field = createForm<ReactFieldProps>(
      {
        type: "object",
        title: "Arrays of primitives",
        description,
        properties: {
          ap0: {
            type: "array",
            default: [null, null],
            items: {
              type: "string",
              title: "Name",
            },
          },
          ap1: {
            type: "array",
            description,
            default: [null, null],
            items: {
              type: "string",
              description,
            },
          },
          ap2: {
            type: "array",
            title: "Array title",
            default: [null, null],
            items: {
              type: "string",
            },
          },
          ap3: {
            type: "array",
            title: "Array title",
            description,
            default: [null, null],
            items: {
              type: "string",
              description,
            },
          },
        },
      },
      { createStore: observable, onCreateField }
    )
    return <Field field={field} />
  },
}

export const ArraysOfArraysOfPrimitives = {
  render: () => {
    const field = createForm<ReactFieldProps>(
      {
        type: "object",
        title: "Arrays of arrays of primitives",
        description,
        properties: {
          aa0: {
            type: "array",
            default: [[null, null]],
            items: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          aa1: {
            type: "array",
            description,
            default: [[null, null]],
            items: {
              type: "array",
              description,
              items: {
                type: "string",
                description,
              },
            },
          },
          aa2: {
            type: "array",
            title: "Array title",
            default: [[null, null]],
            items: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          aa3: {
            type: "array",
            title: "Array title",
            description,
            default: [[null, null]],
            items: {
              type: "array",
              description,
              title: "Person",
              items: {
                type: "string",
                description,
              },
            },
          },
        },
      },
      { createStore: observable, onCreateField }
    )
    return <Field field={field} />
  },
}

export const ArraysOfObjects = {
  render: () => {
    const field = createForm<ReactFieldProps>(
      {
        type: "object",
        title: "Arrays of objects",
        description,
        properties: {
          ao0: {
            type: "array",
            default: [null, null],
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                },
              },
            },
          },
          ao1: {
            type: "array",
            description,
            default: [null, null],
            items: {
              type: "object",
              description,
              properties: {
                field: {
                  type: "string",
                  description,
                },
              },
            },
          },
          ao2: {
            type: "array",
            title: "Array title",
            default: [null, null],
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  title: "Field title",
                },
              },
            },
          },
          ao3: {
            type: "array",
            title: "Array title",
            default: [null, null],
            description,
            items: {
              type: "object",
              description,
              properties: {
                field: {
                  type: "string",
                  title: "Field title",
                  description,
                },
              },
            },
          },
        },
      },
      { createStore: observable, onCreateField }
    )
    return <Field field={field} />
  },
}
