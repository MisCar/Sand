import { useEffect, useRef } from "react"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"
import SvgGauge, { GaugeInstance, GaugeOptions } from "svg-gauge"
import { useElementSize } from "@mantine/hooks"

const Gauge: Widget = ({ source, props }) => {
  const [value] = useNTKey<number>(source, 0)
  const { ref, width, height } = useElementSize<HTMLDivElement>()
  const gaugeEl = useRef<HTMLDivElement>()
  const gaugeRef = useRef<GaugeInstance | null>(null)

  useEffect(() => {
    if (!gaugeRef.current) {
      if (!gaugeEl.current) return
      const options: GaugeOptions = {
        color: (value) => (value < 30 ? "green" : "red"),
      }
      gaugeRef.current = SvgGauge(gaugeEl.current, options)
      gaugeRef.current?.setValue(1)
    }
    gaugeRef.current?.setValue(value)
  }, [value])

  useEffect(() => {
    gaugeRef.current.setValue(value)
  }, [value])

  return (
    <div
      ref={ref}
      style={{
        width: "90%",
        height: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        ref={gaugeEl}
        className="gauge-container"
        style={{
          width: Math.min(width, height),
          height: Math.min(width, height),
        }}
      />
    </div>
  )
}

Gauge.supportedTypes = ["number"]
Gauge.propsInfo = {}

export default Gauge
