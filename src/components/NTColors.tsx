import { useEffect } from "react"
import NetworkTables from "../thirdparty/networktables"
import { useNTKey } from "../hooks"

const NTColors = () => {
  const [backgroundColor] = useNTKey("/Sand/Background Color", "")

  useEffect(() => {
    if (backgroundColor === "") {
      NetworkTables.setValue("/Sand/Background Color", "")
    }
    document.documentElement.style.setProperty(
      "--tab-background",
      backgroundColor
    )
  }, [backgroundColor])

  return <></>
}

export default NTColors
