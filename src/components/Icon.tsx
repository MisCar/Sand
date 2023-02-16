import { useEffect, useState } from "react"
import { getSettings, Settings } from "../listeners"

const Icon = () => {
  const [settings, setCurrentSettings] = useState<Settings>()
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    getSettings()
      .then(setCurrentSettings)
      .catch(() => {})
  }, [])

  return (
    <img
      src={settings?.icon}
      style={{
        maxWidth: "100%",
        maxHeight: 100,
        transform: `rotate(${rotation}deg)`,
        transition: "200ms ease-in-out",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onClick={() => setRotation((r) => r + 72)}
    />
  )
}

export default Icon
