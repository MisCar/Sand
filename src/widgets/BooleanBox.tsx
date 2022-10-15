import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const BooleanBox: Widget = ({ source, props }) => {
  const [checked, setChecked] = useNTKey<boolean>(source, false)

  const trueColor = props?.trueColor ?? "#83f28f"
  const falseColor = props?.falseColor ?? "#ff5c5c"

  return (
    <div
      onClick={() => setChecked(!checked)}
      style={{
        width: "100%",
        height: "100%",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: checked ? trueColor : falseColor,
      }}
    />
  )
}

BooleanBox.supportedTypes = ["boolean"]

export default BooleanBox
