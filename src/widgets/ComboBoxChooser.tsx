import { Select } from "@mantine/core"
import React from "react"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

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
