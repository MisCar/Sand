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
import TableView from "./TableView"
import NumberTextView from "./NumberTextView"
import JsonTextView from "./JsonTextView"
import Gauge from "./Gauge"

export const DEFAULTS_FOR_TYPE: { [key: string]: any } = {
  boolean: "ToggleSwitch",
  number: "NumberTextView",
  string: "TextView",
  "boolean[]": "Label",
  "number[]": "Label",
  "string[]": "Label",
  "String Chooser": "ComboBoxChooser",
  Field2d: "Field",
  Camera: "Camera",
}

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
  NumberTextView,
  JsonTextView,
  NumberSlider,
  TableView,
  Gauge,
}

export default widgets

export const typeToTitle = (widgetType: string) => {
  return widgetType.replace(/([A-Z])/g, " $1").substring(1)
}
