import { NumberInput, TextInput } from "@mantine/core"
import React from "react"
import Widget from "../models/Widget"

interface Props {
  widget: Widget
  currentProps?: {
    [key: string]: any
  }
  setProp: (key: string, value: any) => void
}

const camelToTitle = (camel: string) => {
  return (
    camel[0].toUpperCase() +
    camel.substring(1).replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")
  )
}

const PropEditor: React.FC<Props> = ({ widget, currentProps, setProp }) => {
  if (widget.propsInfo === undefined) {
    return <></>
  }

  return (
    <>
      {Object.keys(widget.propsInfo).map((key) => {
        if (widget.propsInfo[key] === "string") {
          return (
            <TextInput
              spellCheck={false}
              label={camelToTitle(key)}
              style={{ margin: 5 }}
              value={currentProps[key]}
              onChange={(event) =>
                setProp(
                  key,
                  event.currentTarget.value === ""
                    ? undefined
                    : event.currentTarget.value
                )
              }
            />
          )
        } else if (widget.propsInfo[key] === "int") {
          return (
            <NumberInput
              label={camelToTitle(key)}
              style={{ margin: 5 }}
              value={currentProps[key]}
              onChange={(value) => setProp(key, value)}
            />
          )
        } else if (widget.propsInfo[key] === "double") {
          return (
            <TextInput
              type="number"
              label={camelToTitle(key)}
              style={{ margin: 5 }}
              value={currentProps[key]}
              onChange={(event) =>
                setProp(
                  key,
                  event.currentTarget.value === ""
                    ? undefined
                    : parseFloat(event.currentTarget.value)
                )
              }
            />
          )
        } else {
          return <></>
        }
      })}
    </>
  )
}

export default PropEditor
