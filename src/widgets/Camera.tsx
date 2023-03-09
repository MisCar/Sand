import { useElementSize } from "@mantine/hooks"
import { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"

const Camera: Widget = ({ source, props }) => {
  const [streams] = useNTKey<string[]>(source + "/streams", [])
  const [r, setR] = useState(false)
  const { height, width, ref } = useElementSize()
  const rerender = () => setR(!r)

  useEffect(() => {
    setTimeout(rerender, getOrDefault(props, Camera, "reloadRate"))
  }, [r])

  let stream: string | undefined = props?.stream

  if (stream === undefined && streams.length !== 0) {
    stream = streams[0]
    stream = streams[0].substring(streams[0].indexOf("http:"))
  }

  if (stream === undefined) {
    return <p>No stream found</p>
  }

  const showVerticalCrosshair: boolean = getOrDefault(
    props,
    Camera,
    "showVerticalCrosshair"
  )
  const showHorizontalCrosshair: boolean = getOrDefault(
    props,
    Camera,
    "showHorizontalCrosshair"
  )
  const crosshairColor: string = getOrDefault(props, Camera, "crosshairColor")

  const aspectRatio = getOrDefault(props, Camera, "aspectRatio")
  const actualHeight = Math.min(width / aspectRatio, height)
  const actualWidth = actualHeight * aspectRatio

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={ref}
    >
      <iframe
        src={
          stream + (stream.includes("?") ? "&" : "?") + "update=" + Date.now()
        }
        style={{
          width: actualWidth,
          height: actualHeight,
          position: "relative",
          objectFit: "contain",
        }}
      />
      {showHorizontalCrosshair && (
        <div
          style={{
            width: "100%",
            height: 2.5,
            backgroundColor: crosshairColor,
            position: "absolute",
            left: 0,
            top: "50%",
          }}
        />
      )}
      {showVerticalCrosshair && (
        <div
          style={{
            width: 2.5,
            height: "100%",
            backgroundColor: crosshairColor,
            position: "absolute",
            right: "50%",
            top: 0,
          }}
        />
      )}
    </div>
  )
}

Camera.supportedTypes = ["Camera"]
Camera.propsInfo = {
  stream: {
    type: "string",
    placeholder: "Optional, overrides source",
  },
  reloadRate: {
    type: "int",
    default: 1000,
  },
  showVerticalCrosshair: {
    type: "boolean",
    default: false,
  },
  showHorizontalCrosshair: {
    type: "boolean",
    default: false,
  },
  crosshairColor: {
    type: "color",
    default: "white",
  },
  aspectRatio: {
    type: "double",
    default: 16 / 9,
  },
}

export default Camera
