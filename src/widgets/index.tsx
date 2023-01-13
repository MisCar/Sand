import ComboBoxChooser from "./ComboBoxChooser"
import Field from "./Field"
import Graph from "./Graph"
import Label from "./Label"
import ToggleSwitch from "./ToggleSwitch"

import Widget from "../models/Widget"
import BooleanBox from "./BooleanBox"
import Camera from "./Camera"
import ChargeUpGrid from "./ChargeUpGrid"
import Gauge from "./Gauge"
import JsonTextView from "./JsonTextView"
import NumberSlider from "./NumberSlider"
import NumberTextView from "./NumberTextView"
import TableView from "./TableView"
import TextView from "./TextView"

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
  ChargeUpGrid,
}

export default widgets

export const typeToTitle = (widgetType: string) => {
  return widgetType.replace(/([A-Z])/g, " $1").substring(1)
}
