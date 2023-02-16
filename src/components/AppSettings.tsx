import { Button, TextInput } from "@mantine/core"
import { useEffect, useState } from "react"
import { getConfigDir, getSettings, setSettings, Settings } from "../listeners"
import NetworkTables from "../thirdparty/networktables"

const AppSettings = () => {
  const [settings, setCurrentSettings] = useState<Settings>()
  const [configDir, setConfigDir] = useState<string>()

  useEffect(() => {
    getConfigDir()
      .then(setConfigDir)
      .catch(() => {})

    getSettings()
      .then(setCurrentSettings)
      .catch(() => console.log("Couldn't load settings"))
  }, [])

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {configDir && (
        <>
          <p>App Directory</p>
          <small>
            <code>{configDir}</code>
          </small>
        </>
      )}
      <br />
      <TextInput
        label="Robot Address"
        icon={<i className="fa-solid fa-people-group" />}
        value={settings?.robotAddress ?? ""}
        onChange={(event) => {
          const value = event.currentTarget.value
          if (value !== null) {
            setCurrentSettings((settings) => ({
              ...settings,
              robotAddress: value,
            }))
          }
        }}
      />
      <TextInput
        label="Theme Color"
        icon={<i className="fa-solid fa-palette" />}
        value={settings?.themeColor ?? ""}
        onChange={(event) => {
          const value = event.currentTarget.value
          if (value !== null) {
            setCurrentSettings((settings) => ({
              ...settings,
              themeColor: value,
            }))
          }
        }}
      />
      <Button
        style={{ margin: 10 }}
        leftIcon={<i className="fa-solid fa-save" />}
        onClick={() => {
          setSettings(settings)
          NetworkTables.connect(settings.robotAddress ?? "localhost")
        }}
      >
        Save
      </Button>
    </div>
  )
}

export default AppSettings
