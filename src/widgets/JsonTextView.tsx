import { Indicator, TextInput } from "@mantine/core"
import { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const JsonTextView: Widget = ({ source, props }) => {
  const [ntValue, setNtValue] = useNTKey(source)
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(JSON.stringify(ntValue ?? ""))
  }, [ntValue])

  return (
    <Indicator
      inline
      style={{ width: "90%" }}
      styles={{
        indicator: {
          display: JSON.stringify(ntValue ?? "") === value ? "none" : undefined,
        },
      }}
    >
      <TextInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onBlur={(event) => {
          const value = JSON.parse(
            event.currentTarget.value
              .replace(/״/g, '"')
              .replace(/”/g, '"')
              .replace(/“/g, '"')
          )
          setNtValue(value)
        }}
        {...props}
      />
    </Indicator>
  )
}

JsonTextView.supportedTypes = [
  "boolean",
  "number",
  "string",
  "boolean[]",
  "number[]",
  "string[]",
]

export default JsonTextView
