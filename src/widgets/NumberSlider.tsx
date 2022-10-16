import { Slider } from "@mantine/core"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const NumberSlider: Widget = ({ source, props }) => {
  const [value, setValue] = useNTKey(source, 0)
  const step: number = props?.step ?? 0.001

  const split = step.toString().split(".")
  const stepPrecision = split.length === 1 ? 0 : split[1].length

  return (
    <Slider
      value={value}
      onChange={setValue}
      labelAlwaysOn
      style={{ width: "90%" }}
      label={(value) => value.toFixed(stepPrecision)}
      step={step}
      min={-1}
      max={1}
      {...props}
    />
  )
}

NumberSlider.supportedTypes = ["number"]
NumberSlider.propsInfo = {
  min: "double",
  max: "double",
  step: "double",
}

export default NumberSlider
