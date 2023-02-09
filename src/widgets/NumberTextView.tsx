import { Indicator, TextInput } from "@mantine/core"
import { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"

const NumberTextView: Widget = ({ source, props }) => {
  const [ntValue, setNtValue] = useNTKey<number>(source)
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(ntValue === undefined ? "" : ntValue.toString())
  }, [ntValue])

  return (
    <Indicator
      inline
      style={{ width: "90%" }}
      styles={{
        indicator: {
          display: (ntValue ?? "").toString() === value ? "none" : undefined,
        },
      }}
    >
      <TextInput
        type="number"
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value)

          if (getOrDefault(props, NumberTextView, "updateImmediately")) {
            const v = parseFloat(event.currentTarget.value)
            if (!isNaN(v)) {
              setNtValue(v)
            }
          }
        }}
        onBlur={(event) => {
          const v = parseFloat(event.currentTarget.value)
          if (!isNaN(v)) {
            setNtValue(v)
          } else {
            setValue((ntValue ?? "").toString())
          }
        }}
        {...props}
      />
    </Indicator>
  )
}

NumberTextView.supportedTypes = ["number"]

NumberTextView.propsInfo = {
  updateImmediately: {
    type: "boolean",
    default: true,
  },
}

export default NumberTextView
