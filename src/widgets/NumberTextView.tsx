import { Indicator, TextInput } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

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
        onChange={(event) => setValue(event.currentTarget.value)}
        onBlur={(event) => {
          const value = parseFloat(event.currentTarget.value)
          if (!isNaN(value)) {
            setNtValue(value)
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

export default NumberTextView
