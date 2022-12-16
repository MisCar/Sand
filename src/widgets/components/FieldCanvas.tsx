import React, { useEffect, useRef } from "react"
import { useAllNTSubkeysAndValues } from "../../hooks"
import { FieldInfo } from "../field/Fields"

interface Props {
  pixelsPerMeter: number
  fieldInfo: FieldInfo
  bottomMargin: number
  leftMargin: number
  source: string
  colors?: Record<string, string>
}

const FieldCanvas: React.FC<Props> = ({
  pixelsPerMeter,
  fieldInfo,
  bottomMargin,
  leftMargin,
  source,
  colors,
}) => {
  const values = useAllNTSubkeysAndValues(source, "Robot")
  const ref = useRef<HTMLCanvasElement>()

  useEffect(() => {
    const context = ref.current.getContext("2d")
    context.clearRect(0, 0, ref.current.width, ref.current.height)
    context.globalAlpha = 1
    context.lineWidth = ref.current.width / 300
    for (const v in values) {
      if (v.includes("/.")) {
        continue
      }
      context.strokeStyle = "black"
      if (colors !== undefined) {
        const parts = v.split("/")
        context.strokeStyle = colors[parts[parts.length - 1]] ?? "black"
      }
      for (let i = 0; i < values[v].length - 4; i += 3) {
        context.beginPath()
        context.moveTo(
          (values[v][i] / fieldInfo["field-size"][0]) * ref.current.width,
          ((fieldInfo["field-size"][1] - values[v][i + 1]) /
            fieldInfo["field-size"][1]) *
            ref.current.height
        )
        context.lineTo(
          (values[v][i + 3] / fieldInfo["field-size"][0]) * ref.current.width,
          ((fieldInfo["field-size"][1] - values[v][i + 4]) /
            fieldInfo["field-size"][1]) *
            ref.current.height
        )
        context.stroke()
        context.closePath()
      }
    }
  }, [values, pixelsPerMeter])

  return (
    <canvas
      ref={ref}
      width={
        pixelsPerMeter * fieldInfo["field-size"][0] * window.devicePixelRatio
      }
      height={
        pixelsPerMeter * fieldInfo["field-size"][1] * window.devicePixelRatio
      }
      style={{
        position: "absolute",
        bottom: bottomMargin,
        left: leftMargin,
        width: pixelsPerMeter * fieldInfo["field-size"][0],
        height: pixelsPerMeter * fieldInfo["field-size"][1],
      }}
    />
  )
}

export default FieldCanvas
