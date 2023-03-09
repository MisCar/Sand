import { Indicator, TextInput } from "@mantine/core"
import { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"

const NumberTextView: Widget = ({ source, props }) => {
  const precision = getOrDefault(props, NumberTextView, "precision")
  const [ntValue, setNtValue] = useNTKey<number>(source)
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(ntValue === undefined ? "" : ntValue.toFixed(precision))
  }, [ntValue])

  const update = (value: string) => {
    const v = parseFloat(value)
    if (!isNaN(v)) {
      setNtValue(v)
    } else {
      setValue("")
    }
  }

  return (
    <Indicator
      inline
      style={{ width: "90%" }}
      styles={{
        indicator: {
          display:
            (ntValue?.toFixed(precision) ?? "") === value ? "none" : undefined,
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
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            update(event.currentTarget.value)
          } else if (event.key === "s") {
            event.preventDefault()
            update(event.currentTarget.value)
          }
        }}
        onBlur={(event) => update(event.currentTarget.value)}
        {...props}
      />
    </Indicator>
  )
}

NumberTextView.supportedTypes = ["number"]

NumberTextView.propsInfo = {
  updateImmediately: {
    type: "boolean",
    default: false,
  },
  precision: {
    type: "int",
    default: 3,
  },
}

export default NumberTextView
