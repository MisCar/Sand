import { Switch } from "@mantine/core"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const ToggleSwitch: Widget = ({ source, props }) => {
  const [checked, setChecked] = useNTKey<boolean>(source, false)

  return (
    <Switch
      {...props}
      size="xl"
      styles={{
        root: {
          width: props?.expandWidth ? "90%" : undefined,
          display: "contents",
        },
        track: {
          cursor: "pointer",
          backgroundColor: checked ? props?.color + " !important" : undefined,
          borderColor: checked ? "transparent !important" : undefined,
          width: props?.expandWidth ? "100%" : undefined,
        },
      }}
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  )
}

ToggleSwitch.supportedTypes = ["boolean"]
ToggleSwitch.propsInfo = {
  onLabel: "string",
  offLabel: "string",
  color: "string",
  expandWidth: "boolean",
}

export default ToggleSwitch
