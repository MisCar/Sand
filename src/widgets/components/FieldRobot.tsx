import React from "react"
import { useNTKey } from "../../hooks"
import Robot from "../field/robot"

interface Props {
  bottomMargin: number
  leftMargin: number
  pixelsPerMeter: number
  source: string
  robotWidth: number
  robotLength: number
  robotImage?: string
}

const FieldRobot: React.FC<Props> = ({
  bottomMargin,
  leftMargin,
  pixelsPerMeter,
  source,
  robotWidth,
  robotLength,
  robotImage,
}) => {
  const [[x, y, rotation]] = useNTKey<[number, number, number]>(
    source,
    [0, 0, 0]
  )

  const robotWidthPixels = robotWidth * pixelsPerMeter
  const robotLengthPixels = robotLength * pixelsPerMeter

  return (
    <img
      style={{
        position: "absolute",
        bottom: bottomMargin - robotLengthPixels / 2 + y * pixelsPerMeter,
        left: leftMargin - robotWidthPixels / 2 + x * pixelsPerMeter,
        height: robotLengthPixels,
        width: robotWidthPixels,
        transform: "rotate(-" + rotation + "deg)",
      }}
      src={robotImage ?? Robot}
    />
  )
}

export default FieldRobot
