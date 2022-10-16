import { TextInput } from "@mantine/core"
import { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const TextView: Widget = ({ source, props }) => {
  const [ntValue, ntSetValue] = useNTKey(source)
  const [value, setValue] = useState<any>()

  useEffect(() => {
    setValue(JSON.stringify(ntValue))
  }, [ntValue])

  return (
    <TextInput
      style={{ width: "90%" }}
      value={value === undefined ? "" : value.toString()}
      onChange={(event) => setValue(event.currentTarget.value)}
      onBlur={(event) => {
        if (ntValue === undefined || typeof ntValue === "string") {
          ntSetValue(event.currentTarget.value)
        } else if (typeof ntValue === "number") {
          ntSetValue(parseFloat(event.currentTarget.value))
        } else if (typeof ntValue === "boolean") {
          const newValue = event.currentTarget.value.trim().toLowerCase()
          if (newValue === "true") {
            ntSetValue(true)
          } else if (newValue === "false") {
            ntSetValue(false)
          }
        } else if (Array.isArray(ntValue)) {
          try {
            const newValue = JSON.parse(event.currentTarget.value)
            if (Array.isArray(newValue)) {
              ntSetValue(newValue)
            }
          } catch (_) {}
        }
      }}
      {...props}
    />
  )
}

TextView.supportedTypes = [
  "boolean",
  "number",
  "string",
  "boolean[]",
  "number[]",
  "string[]",
]

export default TextView
