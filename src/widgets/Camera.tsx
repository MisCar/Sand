import { useNTKey } from "../hooks"
import Widget from "../models/Widget"

const Camera: Widget = ({ source, props }) => {
  const [streams] = useNTKey<string[]>(source + "/streams", [])

  let stream: string | undefined = props?.stream

  if (stream === undefined && streams.length !== 0) {
    stream = streams[0]
    stream = streams[0].substring(streams[0].indexOf("http:"))
  }

  if (stream === undefined) {
    return <p>No stream found</p>
  }

  return <img src={stream} style={{ maxWidth: "100%", maxHeight: "100%" }} />
}

Camera.supportedTypes = ["Camera"]
Camera.propsInfo = {
  stream: "string",
}

export default Camera
