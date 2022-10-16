import ToggleSwitch from "./ToggleSwitch"
import Label from "./Label"
import ComboBoxChooser from "./ComboBoxChooser"
import Graph from "./Graph"
import Field from "./Field"

import Widget from "../models/Widget"
import BooleanBox from "./BooleanBox"
import Camera from "./Camera"
import TextView from "./TextView"
import NumberSlider from "./NumberSlider"

const widgets: {
  [key: string]: Widget
} = {
  ToggleSwitch,
  BooleanBox,
  Label,
  ComboBoxChooser,
  Graph,
  Field,
  Camera,
  TextView,
  NumberSlider,
}

export default widgets

export const typeToTitle = (widgetType: string) => {
  return widgetType.replace(/([A-Z])/g, " $1").substring(1)
}
