import React, { useEffect, useRef, useState } from "react"
import Widget from "../models/Widget"
import FieldRobot from "./components/FieldRobot"
import useSize from "@react-hook/size"

const fieldInfo = {
  game: "Rapid React",
  "field-image":
    "https://rawcdn.githack.com/wpilibsuite/PathWeaver/ea9469371f7126941c6a91c215a674a2f2a4b4d6/src/main/resources/edu/wpi/first/pathweaver/2022-field.png",
  "field-corners": {
    "top-left": [74, 50],
    "bottom-right": [1774, 900],
  },
  "image-size": [1859, 949],
  "field-size": [16.4592, 8.2296],
}

// w / h
const fieldAspectRatio = fieldInfo["field-size"][0] / fieldInfo["field-size"][1]

const Field: Widget = ({ source, props }) => {
  const target = useRef()
  const [width, height] = useSize(target)
  const [fieldWidth, setFieldWidth] = useState(0)

  useEffect(() => {
    setFieldWidth(Math.min(width, height * fieldAspectRatio))
  }, [width, height])

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
    <div
      style={{ height: "100%", width: "100%", position: "relative" }}
      ref={target}
    >
      <img
        style={{
          width: fieldWidth,
          height: fieldHeight,
          position: "absolute",
          bottom: (height - fieldHeight) / 2,
          left: (width - fieldWidth) / 2,
        }}
        src="https://rawcdn.githack.com/wpilibsuite/PathWeaver/ea9469371f7126941c6a91c215a674a2f2a4b4d6/src/main/resources/edu/wpi/first/pathweaver/2022-field.png"
      />
      <FieldRobot
        bottomMargin={bottomMargin}
        leftMargin={leftMargin}
        pixelsPerMeter={pixelsPerMeter}
        source={source + "/Robot"}
      />
      <canvas
        style={{
          position: "absolute",
          bottom: bottomMargin,
          left: leftMargin,
          width: pixelsPerMeter * fieldInfo["field-size"][0],
          height: pixelsPerMeter * fieldInfo["field-size"][1],
        }}
      />
    </div>
  )
}

Field.supportedTypes = ["Field2d"]

export default Field
