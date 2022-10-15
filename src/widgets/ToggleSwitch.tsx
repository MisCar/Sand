import { Switch } from "@mantine/core"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const ToggleSwitch: Widget = ({ source, props }) => {
  const [checked, setChecked] = useNTKey<boolean>(source, false)

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
