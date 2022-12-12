import { useEffect, useState } from "react"
import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"

const Camera: Widget = ({ source, props }) => {
  const [streams] = useNTKey<string[]>(source + "/streams", [])
  const [r, setR] = useState(false)
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

  return (
    <img
      src={stream + (stream.includes("?") ? "&" : "?") + "update=" + Date.now()}
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
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
}

export default Camera
