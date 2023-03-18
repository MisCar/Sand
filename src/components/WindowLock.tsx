import { Switch } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import {
  appWindow,
  currentMonitor,
  LogicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/window"
import { useEffect } from "react"

const DRIVERSTATION_HEIGHT = 268

const WindowLock = () => {
  const [checked, setChecked] = useLocalStorage<boolean>({
    key: "Lock",
    defaultValue: false,
  })

  useEffect(() => {
    setChecked(false)
  }, [])

  const handler = async (lock: boolean) => {
    setChecked(lock)
    if (lock) {
      const monitor = await currentMonitor()
      await appWindow.setResizable(false)
      await appWindow.setDecorations(false)
      await appWindow.setPosition(new LogicalPosition(0, 0))
      await appWindow.setSize(
        new PhysicalSize(
          monitor.size.width,
          monitor.size.height - DRIVERSTATION_HEIGHT * monitor.scaleFactor
        )
      )
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
