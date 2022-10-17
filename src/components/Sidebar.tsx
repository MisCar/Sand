import { Accordion, ColorScheme, SegmentedControl } from "@mantine/core"
import React from "react"
import { useNTConnected } from "../hooks"
import Mode from "../models/Mode"
import Schema, { WidgetSelector } from "../models/Schema"
import AppSettings from "./AppSettings"
import ConnectionIndicator from "./ConnectionIndicator"
import IconAndText from "./IconAndText"
import ShortcutManager from "./ShortcutManager"
import WidgetDisplay from "./WidgetDisplay"
import WidgetEditor from "./WidgetEditor"
import WindowLock from "./WindowLock"

interface Props {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
  mode: Mode
  setMode: (mode: Mode) => void
  selectedWidget: WidgetSelector | undefined
  schema: Schema
  setSchema: React.Dispatch<React.SetStateAction<Schema>>
  accordionState: string[]
  setAccordionState: React.Dispatch<React.SetStateAction<string[]>>
}

const Sidebar: React.FC<Props> = ({
  colorScheme,
  setColorScheme,
  mode,
  setMode,
  selectedWidget,
  schema,
  setSchema,
  accordionState,
  setAccordionState,
}) => {
  const connected = useNTConnected()

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 20px)",
        padding: 10,
        alignItems: "center",
        flex: "none",
        borderRightWidth: 3,
        borderRightColor: "white",
        userSelect: "none",
        maxWidth: 300,
      }}
    >
      <div
        style={{
          flex: "none",
          textAlign: "center",
        }}
      >
        <h1>Sand</h1>
        <SegmentedControl
          style={{ marginBottom: 5 }}
          value={mode}
          onChange={setMode}
          data={[
            {
              label: (
                <IconAndText
                  icon="fa-solid fa-play"
                  text="Play"
                  hideText={mode === Mode.Play}
                />
              ),
              value: Mode.Play,
            },
            {
              label: (
                <IconAndText
                  icon="fa-solid fa-brush"
                  text="Edit"
                  hideText={mode === Mode.Play}
                />
              ),
              value: Mode.Edit,
            },
          ]}
        />
      </div>
      <div
        style={{
          flexGrow: 1,
          width: "100%",
          overflowY: "auto",
          margin: 10,
        }}
      >
        {mode === Mode.Edit && (
          <Accordion
            style={{ width: "100%" }}
            multiple
            value={accordionState}
            onChange={setAccordionState}
          >
            <Accordion.Item value="widgets">
              <Accordion.Control>
                <IconAndText icon="fa-solid fa-gauge-high" text="Widgets" />
              </Accordion.Control>
              <Accordion.Panel>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <WidgetDisplay />
                </div>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="modify">
              <Accordion.Control>
                <IconAndText icon="fa-solid fa-pen" text="Modify" />
              </Accordion.Control>
              <Accordion.Panel>
                {selectedWidget !== undefined && (
                  <WidgetEditor
                    selectedWidget={selectedWidget}
                    schema={schema}
                    setSchema={setSchema}
                  />
                )}
                {selectedWidget !== undefined || <p>No widget selected.</p>}
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="keyboard shortcuts">
              <Accordion.Control>
                <IconAndText
                  icon="fa-solid fa-keyboard"
                  text="Keyboard Shortcuts"
                />
              </Accordion.Control>
              <Accordion.Panel>
                <ShortcutManager />
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="settings">
              <Accordion.Control>
                <IconAndText icon="fa-solid fa-gear" text="App Settings" />
              </Accordion.Control>
              <Accordion.Panel>
                <AppSettings />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
      </div>
      <div
        style={{
          flex: "none",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SegmentedControl
          value={colorScheme}
          onChange={setColorScheme}
          data={[
            {
              label: (
                <IconAndText
                  icon="fa-solid fa-sun"
                  text="Light"
                  hideText={mode === Mode.Play}
                />
              ),
              value: "light",
            },
            {
              label: (
                <IconAndText
                  icon="fa-solid fa-moon"
                  text="Dark"
                  hideText={mode === Mode.Play}
                />
              ),
              value: "dark",
            },
          ]}
        />
        <ConnectionIndicator connected={connected} />
        <WindowLock />
      </div>
    </div>
  )
}

export default Sidebar
