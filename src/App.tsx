import { ColorScheme, Grid, MantineProvider } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import Sidebar from "./components/Sidebar"
import TabLayout from "./components/TabLayout"
import Mode from "./models/Mode"

import "./thirdparty/networktables"

import "./index.css"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "@fortawesome/fontawesome-free/css/all.css"
import Schema, { WidgetSelector } from "./models/Schema"
import { DEFAULT_FILE, restoreFile } from "./listeners"

// @ts-ignore
NetworkTables.connectToWs("localhost:8888")

const App = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark")
  const [mode, setMode] = useState<Mode>(Mode.Play)
  const [schema, setSchema] = useState<Schema>(
    JSON.parse(localStorage.getItem("Schema") ?? '{ "tabs": [] }')
  )
  const [selectedWidget, setSelectedWidget] = useState<WidgetSelector>()
  const [accordionState, setAccordionState] = useState<string[]>([])

  useEffect(() => {
    // @ts-ignore
    window.setSchema = (schema: string) => setSchema(JSON.parse(schema))
    // @ts-ignore
    window.getSchema = () => JSON.stringify(schema, null, 2)

    restoreFile(DEFAULT_FILE)
  }, [])

  const isModifying = mode === Mode.Edit && accordionState !== undefined

  return (
    <MantineProvider
      theme={{ colorScheme: colorScheme }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Grid>
        <Grid.Col
          span={mode === Mode.Play ? "content" : 2}
          style={{ padding: mode === Mode.Play ? 10 : undefined }}
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
          />
        </Grid.Col>
        <Grid.Col span={10}>
          <TabLayout
            mode={mode}
            schema={schema}
            setSchema={setSchema}
            selectedWidget={selectedWidget}
            modify={(selector) => {
              setSelectedWidget(selector)
              setAccordionState(["modify"])
            }}
            isModifying={isModifying}
          />
        </Grid.Col>
      </Grid>
    </MantineProvider>
  )
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />)

export default App
