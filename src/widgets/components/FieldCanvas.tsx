import React, { useEffect, useRef, useState } from "react"
import { useAllNTSubkeysAndValuesCallback } from "../../hooks"
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
  const ref = useRef<HTMLCanvasElement>()
  const [values, setValues] = useState<Record<string, any>>({})

  useAllNTSubkeysAndValuesCallback(
    source,
    (values) => setValues({ ...values }),
    "Robot"
  )

  useEffect(() => {
    if (!ref.current) {
      return
    }
    const context = ref.current.getContext("2d")
    context.clearRect(0, 0, ref.current.width, ref.current.height)
    context.globalAlpha = 1
    context.lineWidth = ref.current.width / 300
    for (const v in values) {
      let color: string
      if (colors !== undefined) {
        const parts = v.split("/")
        color = colors[parts[parts.length - 1]] ?? "black"
      }

      if (v.includes("/.")) {
        continue
      }

      if (values[v]?.length === 3) {
        context.fillStyle = color
        context.beginPath()

        context.arc(
          (values[v][0] / fieldInfo["field-size"][0]) * ref.current.width,
          ((fieldInfo["field-size"][1] - values[v][1]) /
            fieldInfo["field-size"][1]) *
            ref.current.height,
          10,
          0,
          2 * Math.PI
        )
        context.fill()
        continue
      }

      context.strokeStyle = color
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
