import { Button, TextInput } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { getSettings, setSettings, Settings } from "../listeners"

const AppSettings = () => {
  const [settings, setCurrentSettings] = useState<Settings>()

  useEffect(() => {
    getSettings()
      .then(setCurrentSettings)
      .catch(() => console.log("Couldn't load settings"))
  }, [])

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
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
        onClick={() => setSettings(settings)}
      >
        Save
      </Button>
    </div>
  )
}

export default AppSettings
