import React, { useEffect, useState } from "react"
import Widget from "../models/Widget"

const Label: Widget = ({ source, props }) => {
  const [text, setText] = useState(NetworkTables.getValue(source))

  useEffect(() => {
    NetworkTables.addKeyListener(
      source,
      (key: string, value: any, isNew: boolean) => {
        setText(value.toString())
      },
      true
    )
  }, [source])

  return <p style={props}>{text}</p>
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
