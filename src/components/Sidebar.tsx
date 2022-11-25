import { Accordion, ColorScheme, SegmentedControl } from "@mantine/core"
import React from "react"
import { useNTConnected } from "../hooks"
import Mode from "../models/Mode"
import Schema, { WidgetSelector } from "../models/Schema"
import AppSettings from "./AppSettings"
import ConnectionIndicator from "./ConnectionIndicator"
import IconAndText from "./IconAndText"
import LazyAccordionPanel from "./LazyAccordionPanel"
import NTTree from "./NTTree"
import ShortcutManager from "./ShortcutManager"
import TabEditor from "./TabEditor"
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
  accordionState: string
  setAccordionState: React.Dispatch<React.SetStateAction<string>>
  activeTab: string
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
  activeTab,
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
        maxWidth:
          accordionState === "keyboard shortcuts" || accordionState === "tree"
            ? 600
            : 280,
        overflow: "hidden",
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
            value={accordionState}
            onChange={setAccordionState}
          >
            <Accordion.Item value="widgets">
              <Accordion.Control>
                <IconAndText icon="fa-solid fa-gauge-high" text="Widgets" />
              </Accordion.Control>
              <LazyAccordionPanel accordionState={accordionState} tab="widgets">
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
              </LazyAccordionPanel>
            </Accordion.Item>
            <Accordion.Item value="tree">
              <Accordion.Control>
                <IconAndText icon="fa-solid fa-wifi" text="NetworkTables" />
              </Accordion.Control>
              <LazyAccordionPanel accordionState={accordionState} tab="tree">
                <NTTree />
              </LazyAccordionPanel>
            </Accordion.Item>
            <Accordion.Item value="modify">
              <Accordion.Control>
                <IconAndText icon="fa-solid fa-pen" text="Modify" />
              </Accordion.Control>
              <LazyAccordionPanel accordionState={accordionState} tab="modify">
                {selectedWidget !== undefined && (
                  <WidgetEditor
                    selectedWidget={selectedWidget}
                    schema={schema}
                    setSchema={setSchema}
                  />
                )}
                {selectedWidget !== undefined || <p>No widget selected.</p>}
              </LazyAccordionPanel>
            </Accordion.Item>
            <Accordion.Item value="tab">
              <Accordion.Control>
                <IconAndText icon="fa-solid fa-table-cells" text="Tab" />
              </Accordion.Control>
              <LazyAccordionPanel accordionState={accordionState} tab="tab">
                <TabEditor
                  schema={schema}
                  setSchema={setSchema}
                  activeTab={activeTab}
                />
              </LazyAccordionPanel>
            </Accordion.Item>
            <Accordion.Item value="keyboard shortcuts">
              <Accordion.Control>
                <IconAndText
                  icon="fa-solid fa-keyboard"
                  text="Keyboard Shortcuts"
                />
              </Accordion.Control>
              <LazyAccordionPanel
                accordionState={accordionState}
                tab="keyboard shortcuts"
              >
                <ShortcutManager schema={schema} setSchema={setSchema} />
              </LazyAccordionPanel>
            </Accordion.Item>
            <Accordion.Item value="settings">
              <Accordion.Control>
                <IconAndText icon="fa-solid fa-gear" text="App Settings" />
              </Accordion.Control>
              <LazyAccordionPanel
                accordionState={accordionState}
                tab="settings"
              >
                <AppSettings />
              </LazyAccordionPanel>
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
