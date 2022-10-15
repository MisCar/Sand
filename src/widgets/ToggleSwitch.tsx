import { Switch } from "@mantine/core"
import React from "react"
import Widget from "../models/Widget"
import { useNTKey } from "../hooks"

const ToggleSwitch: Widget = ({ source, props }) => {
  const [checked, setChecked, isUpToDate] = useNTKey<boolean>(source, false)

  return (
    <Switch
      {...props}
      size="xl"
      styles={{ input: { cursor: "pointer" } }}
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  )
}

ToggleSwitch.supportedTypes = ["boolean"]

export default ToggleSwitch
