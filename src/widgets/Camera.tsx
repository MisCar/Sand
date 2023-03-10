import { useElementSize } from "@mantine/hooks"
import { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"

const ORIENTATION_MAPPING: Record<string, number> = {
  Normal: 0,
  Right: 90,
  Left: -90,
  "Upside Down": 180,
}

const VERTICAL_ORIENTATIONS = ["Right", "Left"]

const Camera: Widget = ({ source, props }) => {
  const [connected, setConnected] = useState(true)
  const [streams] = useNTKey<string[]>(source + "/streams", [])
  const [r, setR] = useState(false)
  const { height, width, ref } = useElementSize()
  const rerender = () => setR(!r)

  let stream: string | undefined = props?.stream

  if (stream === undefined && streams.length !== 0) {
    stream = streams[0]
    stream = streams[0].substring(streams[0].indexOf("http:"))
  }

  useEffect(() => {
    const timeout = setInterval(async () => {
      if (stream) {
        fetch(
          stream + (stream.includes("?") ? "&" : "?") + "update=" + Date.now()
        )
          .then(() => {
            if (!connected) {
              console.log("Rerendering image")
              rerender()
            }
            setConnected(true)
          })
          .catch((error) => {
            console.log("Disconnected", stream, error)
            setConnected(false)
          })
      }
    }, getOrDefault(props, Camera, "reloadRate"))

    return () => clearInterval(timeout)
  }, [r, stream])

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
  const verticalCrosshairOffset: number = getOrDefault(
    props,
    Camera,
    "verticalCrosshairOffset"
  )
  const horizontalCrosshairOffset: number = getOrDefault(
    props,
    Camera,
    "horizontalCrosshairOffset"
  )

  const orientation: string = getOrDefault(props, Camera, "orientation")
  const aspectRatio = getOrDefault(props, Camera, "aspectRatio")
  const baseWidth = getOrDefault(props, Camera, "baseWidth")
  const rotation = ORIENTATION_MAPPING[orientation]
  const actualWidth = VERTICAL_ORIENTATIONS.includes(orientation)
    ? Math.min(height, width * aspectRatio)
    : Math.min(width, height * aspectRatio)
  const scale = actualWidth / baseWidth

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      ref={ref}
    >
      <iframe
        src={
          stream + (stream.includes("?") ? "&" : "?") + "update=" + Date.now()
        }
        style={{
          width: actualWidth / scale,
          height: actualWidth / aspectRatio / scale,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          pointerEvents: "none",
          position: "absolute",
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
            top: `calc(50% + ${horizontalCrosshairOffset * scale}px)`,
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
            right: `calc(50% + ${verticalCrosshairOffset * scale}px)`,
            top: 0,
          }}
        />
      )}
      {connected || (
        <p style={{ position: "absolute", color: "red", bottom: 10 }}>
          Disconnected
        </p>
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
  orientation: {
    type: "select",
    choices: ["Normal", "Right", "Left", "Upside Down"],
    default: "Normal",
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
    default: 4 / 3,
  },
  baseWidth: {
    type: "double",
    default: 320,
  },
  verticalCrosshairOffset: {
    type: "double",
    default: 0,
  },
  horizontalCrosshairOffset: {
    type: "double",
    default: 0,
  },
}

export default Camera
