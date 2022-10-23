import React from "react"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const Label: Widget = ({ source, props }) => {
  const [value] = useNTKey(source)

  let string = value === undefined ? "" : value.toString()
  if (props?.precision !== undefined) {
    const precision = Math.min(100, Math.max(1, props.precision))
    if (typeof value === "number") {
      string = value.toPrecision(precision)
    } else if (Array.isArray(value) && typeof value[0] === "number") {
      string = value.map((f) => f.toPrecision(precision)).join(", ")
    }
  }

  return <p style={props}>{string}</p>
}

Label.supportedTypes = [
  "boolean",
  "number",
  "string",
  "boolean[]",
  "number[]",
  "string[]",
]

Label.propsInfo = {
  fontSize: "int",
  fontWeight: "string",
  precision: "int",
}

export default Label
