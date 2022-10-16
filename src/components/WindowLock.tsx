import { Switch } from "@mantine/core"
import { appWindow, LogicalPosition } from "@tauri-apps/api/window"
import { useState } from "react"

const WindowLock = () => {
  const [checked, setChecked] = useState(false)

  const handler = (lock: boolean) => {
    setChecked(lock)
    if (lock) {
      appWindow.setPosition(new LogicalPosition(0, 0))
      appWindow.setResizable(false)
      appWindow.setDecorations(false)
    } else {
      appWindow.setResizable(true)
      appWindow.setDecorations(true)
    }
  }

  return (
    <Switch
      size="lg"
      checked={checked}
      thumbIcon={
        checked ? (
          <i style={{ color: "black" }} className="fa-solid fa-lock" />
        ) : (
          <i className="fa-solid fa-lock-open" />
        )
      }
      onChange={(event) => handler(event.currentTarget.checked)}
      label="Window Lock"
    />
  )
}

export default WindowLock
