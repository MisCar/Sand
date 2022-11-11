import React from "react"
import Widget from "../models/Widget"
import { useNTKey } from "../hooks"
import { Indicator, Select } from "@mantine/core"

const ComboBoxChooser: Widget = ({ source, props }) => {
  const [active] = useNTKey<string>(source + "/active", undefined)
  const [selected, setSelected] = useNTKey<string>(source + "/selected", active)
  const [options] = useNTKey<string[]>(source + "/options", [])

  return (
    <Select
      withinPortal
      style={{ width: "90%" }}
      {...props}
      value={active}
      onChange={setSelected}
      data={options}
    />
  )
}

ComboBoxChooser.supportedTypes = ["String Chooser"]

export default ComboBoxChooser
