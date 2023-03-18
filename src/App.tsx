import { ColorScheme, MantineProvider, Tuple } from "@mantine/core"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import Sidebar from "./components/Sidebar"
import TabLayout from "./components/TabLayout"
import Mode from "./models/Mode"

import NetworkTables from "./thirdparty/networktables"

import "@fortawesome/fontawesome-free/css/all.css"
import { NotificationsProvider, showNotification } from "@mantine/notifications"
import { register, unregister } from "@tauri-apps/api/globalShortcut"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import NTColors from "./components/NTColors"
import SoundListener from "./components/SoundListener"
import { useNTKey } from "./hooks"
import "./index.css"
import {
  getDefaultFile,
  getSettings,
  isFocused,
  restoreFile,
  Settings,
} from "./listeners"
import Schema, { WidgetSelector } from "./models/Schema"

let previousSchema: Schema

const App = () => {
  const [activeTab, setActiveTab] = useNTKey<string>("/Sand/ActiveTab", "0")
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark")
  const [mode, setMode] = useState<Mode>(Mode.Play)
  const [schema, setSchema] = useState<Schema>({ tabs: [] })
  const [selectedWidget, setSelectedWidget] = useState<WidgetSelector>()
  const [accordionState, setAccordionState] = useState<string>()
  const [settings, setSettings] = useState<Settings>()

  useEffect(() => {
    // @ts-ignore
    window.setSchema = (schema: string) => {
      const parsed: Schema = JSON.parse(schema)
      if (parsed.tabs === undefined || !Array.isArray(parsed.tabs)) {
        showNotification({
          title: "Failed to set schema",
          message: "Your schema has an invalid tabs value.",
          color: "red",
          icon: <i className="fa-solid fa-exclamation-triangle" />,
        })
        return
      }
      setSchema(parsed)
    }

    getDefaultFile()
      .then((file) => restoreFile(file))
      .catch(() => console.log("Couldn't load default schema"))
    getSettings()
      .then(setSettings)
      .catch(() => console.log("Couldn't load settings"))
  }, [])

  useEffect(() => {
    ;(async () => {
      if (previousSchema !== undefined) {
        for (const shortcut of previousSchema?.shortcuts ?? []) {
          try {
            await unregister(shortcut.keyboard)
          } catch (_) {}
        }
      }

      for (const shortcut of schema?.shortcuts ?? []) {
        if (shortcut.keyboard !== "") {
          register(
            shortcut.keyboard,
            shortcut.mode === "set-true"
              ? () => {
                  if (isFocused()) {
                    NetworkTables.setValue(shortcut.ntKey, true)
                  }
                }
              : () => {
                  if (isFocused()) {
                    NetworkTables.setValue(
                      shortcut.ntKey,
                      !NetworkTables.getValue(shortcut.ntKey, false)
                    )
                  }
                }
          )
        }
      }

      previousSchema = schema
    })()
  }, [schema])

  // @ts-ignore
  window.getSchema = () => JSON.stringify(schema, null, 2)

  const isModifying = mode === Mode.Edit && accordionState !== undefined

  return (
    <MantineProvider
      theme={{
        colorScheme: colorScheme,
        colors: settings?.themeColor
          ? {
              brand: new Array<string>(10).fill(settings.themeColor) as Tuple<
                string,
                10
              >,
            }
          : undefined,
        primaryColor: settings?.themeColor ? "brand" : undefined,
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider>
        <NTColors />

        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              flex: "none",
              padding: mode === Mode.Play ? 10 : undefined,
            }}
          >
            <Sidebar
              colorScheme={colorScheme}
              setColorScheme={setColorScheme}
              mode={mode}
              setMode={setMode}
              selectedWidget={selectedWidget}
              schema={schema}
              setSchema={setSchema}
              accordionState={accordionState}
              setAccordionState={setAccordionState}
              activeTab={activeTab}
            />
          </div>
          <div style={{ flexGrow: 1 }}>
            <TabLayout
              mode={mode}
              schema={schema}
              setSchema={setSchema}
              selectedWidget={selectedWidget}
              modify={(selector) => {
                setSelectedWidget(selector)
                setAccordionState("modify")
              }}
              isModifying={isModifying}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
        <SoundListener />
      </NotificationsProvider>
    </MantineProvider>
  )
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />)

export default App
