import React from "react"
import Widget from "../models/Widget"
import { useNTKey } from "../hooks"
import { Select } from "@mantine/core"

const ComboBoxChooser: Widget = ({ source, props }) => {
  const [active, setActive] = useNTKey<string>(source + "/active", undefined)
  const [options] = useNTKey<string[]>(source + "/options", [])

  return (
    <Select {...props} value={active} onChange={setActive} data={options} />
  )
}

ComboBoxChooser.supportedTypes = ["String Chooser"]

export default ComboBoxChooser
