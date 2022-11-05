import { NumberInput, Switch, TextInput } from "@mantine/core"
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

const STYLES: React.CSSProperties = {
  marginTop: 10,
  width: "100%",
}

const PropEditor: React.FC<Props> = ({ widget, currentProps, setProp }) => {
  if (widget?.propsInfo === undefined) {
    return <></>
  }

  currentProps = currentProps ?? {}

  return (
    <>
      {Object.keys(widget.propsInfo).map((key) => {
        if (
          widget.propsInfo[key].type === "string" ||
          widget.propsInfo[key].type === "color"
        ) {
          const color: string =
            currentProps[key] ?? widget.propsInfo[key].default ?? ""
          return (
            <TextInput
              key={key}
              spellCheck={false}
              icon={
                widget.propsInfo[key].type === "color" ? (
                  <i className="fa-solid fa-palette" />
                ) : undefined
              }
              label={camelToTitle(key)}
              style={STYLES}
              value={color}
              placeholder={widget.propsInfo[key]?.placeholder}
              onChange={(event) =>
                setProp(
                  key,
                  event.currentTarget.value === ""
                    ? undefined
                    : event.currentTarget.value
                )
              }
              rightSection={
                widget.propsInfo[key].type === "color" ? (
                  <div
                    style={{
                      backgroundColor: color,
                      width: "50%",
                      height: "50%",
                      borderRadius: "100%",
                    }}
                  />
                ) : undefined
              }
            />
          )
        } else if (widget.propsInfo[key].type === "int") {
          return (
            <NumberInput
              key={key}
              label={camelToTitle(key)}
              style={STYLES}
              value={currentProps[key] ?? widget.propsInfo[key].default}
              onChange={(value) => setProp(key, value)}
            />
          )
        } else if (widget.propsInfo[key].type === "double") {
          return (
            <TextInput
              key={key}
              type="number"
              label={camelToTitle(key)}
              style={STYLES}
              value={currentProps[key] ?? widget.propsInfo[key].default ?? ""}
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
        } else if (widget.propsInfo[key].type === "boolean") {
          return (
            <Switch
              key={key}
              style={STYLES}
              styles={{ track: { cursor: "pointer" } }}
              label={camelToTitle(key)}
              checked={currentProps[key] ?? widget.propsInfo[key].default}
              onChange={(event) => setProp(key, event.currentTarget.checked)}
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
