import { Switch } from "@mantine/core"
import { appWindow, LogicalPosition, LogicalSize } from "@tauri-apps/api/window"
import { useState } from "react"

const WindowLock = () => {
  const [checked, setChecked] = useState(false)

  const handler = async (lock: boolean) => {
    setChecked(lock)
    if (lock) {
      await appWindow.setResizable(false)
      await appWindow.setDecorations(false)
      await appWindow.setPosition(new LogicalPosition(0, 0))
      await appWindow.setSize(new LogicalSize(1920, 820))
      await appWindow.setAlwaysOnTop(true)
    } else {
      await appWindow.setResizable(true)
      await appWindow.setDecorations(true)
      await appWindow.setAlwaysOnTop(false)
    }
  }

  return (
    <Switch
      size="lg"
      checked={checked}
      styles={{ track: { cursor: "pointer" } }}
      thumbIcon={
        checked ? (
          <i style={{ color: "black" }} className="fa-solid fa-lock" />
        ) : (
          <i className="fa-solid fa-lock-open" />
        )
      }
      onChange={(event) => handler(event.currentTarget.checked)}
    />
  )
}

export default WindowLock
