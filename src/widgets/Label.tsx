import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"

const Label: Widget = ({ source, props }) => {
  const [value] = useNTKey(source)

  let string = value === undefined ? "" : value.toString()

  const precision = getOrDefault(props, Label, "precision")
  if (typeof value === "number") {
    string = value.toFixed(precision)
  } else if (Array.isArray(value) && typeof value[0] === "number") {
    string = value.map((f) => f.toFixed(precision)).join(", ")
  }

  if (getOrDefault(props, Label, "trim")) {
    const trimLength = getOrDefault(props, Label, "trimLength")
    if (string.length > trimLength) {
      string = string.substring(0, trimLength) + "..."
    }
  }

  return <p style={{ display: "inline", ...props }}>{string}</p>
}

Label.supportedTypes = [
  "boolean",
  "number",
  "string",
  "boolean[]",
  "number[]",
  "string[]",
]

Label.propsInfo = {
  fontSize: {
    type: "int",
  },
  fontWeight: {
    type: "string",
  },
  precision: {
    type: "int",
    default: 3,
  },
  trim: {
    type: "boolean",
    default: false,
  },
  trimLength: {
    type: "int",
    default: 30,
  },
}

export default Label
