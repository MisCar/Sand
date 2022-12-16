import { useElementSize } from "@mantine/hooks"
import { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"
import FieldCanvas from "./components/FieldCanvas"
import FieldRobot from "./components/FieldRobot"
import Fields from "./field/Fields"

const Field: Widget = ({ source, props }) => {
  let { ref, width, height } = useElementSize()

  const [fieldWidth, setFieldWidth] = useState(0)
  const [alliance] = useNTKey("/FMSInfo/IsRedAlliance", true)

  const fieldInfo = Fields.find(
    (f) => f.game === getOrDefault(props, Field, "field")
  )

  // w / h
  const fieldAspectRatio =
    fieldInfo["field-size"][0] / fieldInfo["field-size"][1]

  useEffect(() => {
    if (props?.vertical) {
      setFieldWidth(Math.min(height, width * fieldAspectRatio))
    } else {
      setFieldWidth(Math.min(width, height * fieldAspectRatio))
    }
  }, [width, height, props])

  if (!fieldInfo) {
    return <></>
  }

  const fieldHeight = fieldWidth / fieldAspectRatio
  const bottomMargin =
    (height - fieldHeight) / 2 +
    fieldHeight *
      (1 -
        fieldInfo["field-corners"]["bottom-right"][1] /
          fieldInfo["image-size"][1])
  const leftMargin =
    (width - fieldWidth) / 2 +
    (fieldWidth * fieldInfo["field-corners"]["top-left"][0]) /
      fieldInfo["image-size"][0]

  const pixelsPerMeter =
    (fieldWidth / fieldInfo["field-size"][0]) *
    ((fieldInfo["field-corners"]["bottom-right"][0] -
      fieldInfo["field-corners"]["top-left"][0]) /
      fieldInfo["image-size"][0])

  return (
    <>
      <div style={{ width: "100%", height: "100%" }} ref={ref} />
      <div
        style={{
          height: height,
          width: width,
          position: "absolute",
        }}
      >
        <div
          style={{
            height: props?.vertical ? width : height,
            width: props?.vertical ? height : width,
            position: "relative",
            left: props?.vertical ? width - height : 0,
            bottom: props?.vertical ? width - height : 0,
            rotate: props?.vertical ? (alliance ? "90deg" : "-90deg") : "0deg",
          }}
        >
          <img
            style={{
              width: fieldWidth,
              height: fieldHeight,
              position: "absolute",
              bottom: (height - fieldHeight) / 2,
              left: (width - fieldWidth) / 2,
            }}
            src={fieldInfo["field-image"]}
          />
          <FieldRobot
            bottomMargin={bottomMargin}
            leftMargin={leftMargin}
            pixelsPerMeter={pixelsPerMeter}
            source={source + "/Robot"}
            robotWidth={getOrDefault(props, Field, "robotWidth")}
            robotLength={getOrDefault(props, Field, "robotLength")}
          />
          <FieldCanvas
            source={source}
            pixelsPerMeter={pixelsPerMeter}
            fieldInfo={fieldInfo}
            bottomMargin={bottomMargin}
            leftMargin={leftMargin}
            colors={props?.colors}
          />
        </div>
      </div>
    </>
  )
}

Field.supportedTypes = ["Field2d"]

Field.propsInfo = {
  field: {
    type: "select",
    choices: [
      "Rapid React",
      "Infinite Recharge 2021",
      "Infinite Recharge",
      "Destination: Deep Space",
      "FIRST Power Up",
    ],
    default: "Rapid React",
  },
  robotWidth: {
    type: "double",
    default: 0.76,
  },
  robotLength: {
    type: "double",
    default: 0.76,
  },
  vertical: {
    type: "boolean",
  },
}

export default Field
