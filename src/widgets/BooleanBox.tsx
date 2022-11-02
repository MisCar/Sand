import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"

const BooleanBox: Widget = ({ source, props }) => {
  const [checked] = useNTKey<boolean>(source, false)

  const trueColor = getOrDefault(props, BooleanBox, "trueColor")
  const falseColor = getOrDefault(props, BooleanBox, "falseColor")

  return (
    <div
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
BooleanBox.propsInfo = {
  trueColor: {
    type: "color",
    default: "#83f28f",
  },
  falseColor: {
    type: "color",
    default: "#ff5c5c",
  },
}

export default BooleanBox
