import React, { useEffect } from "react"
import { useNTKey } from "../../hooks"

interface Props {
  bottomMargin: number
  leftMargin: number
  pixelsPerMeter: number
  source: string
}

const robotWidth = 0.76
const robotLength = 0.76

const FieldRobot: React.FC<Props> = ({
  bottomMargin,
  leftMargin,
  pixelsPerMeter,
  source,
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
      src="https://raw.githubusercontent.com/wpilibsuite/shuffleboard/main/plugins/base/src/main/resources/edu/wpi/first/shuffleboard/plugin/base/widget/field/robot.png"
    />
  )
}

export default FieldRobot
