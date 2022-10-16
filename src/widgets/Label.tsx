import React from "react"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const Label: Widget = ({ source, props }) => {
  const [value] = useNTKey(source)

  return <p style={props}>{value === undefined ? "" : value.toString()}</p>
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
}

export default Label
