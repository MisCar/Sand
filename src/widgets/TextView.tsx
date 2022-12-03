import { TextInput } from "@mantine/core"
import React from "react"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const TextView: Widget = ({ source, props }) => {
  const [value, setValue] = useNTKey<string>(source, "")

  return (
    <TextInput
      spellCheck={false}
      style={{ width: "90%" }}
      value={value === undefined ? "" : value}
      onChange={(event) => setValue(event.currentTarget.value)}
      {...props}
    />
  )
}

TextView.supportedTypes = ["string"]

export default TextView
