import {
  Accordion,
  Alert,
  Autocomplete,
  Badge,
  Button,
  ColorScheme,
  SegmentedControl,
  Select,
} from "@mantine/core"
import React, { useState } from "react"
import Mode from "../models/Mode"
import { KeysAndTypes, useAllNTKeys, useNTConnected } from "../hooks"
import ConnectionIndicator from "./ConnectionIndicator"
import WidgetDisplay from "./WidgetDisplay"
import Schema, { WidgetSelector } from "../models/Schema"
import widgets, { typeToTitle } from "../widgets"
import IconAndText from "./IconAndText"
import ShortcutManager from "./ShortcutManager"

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
  const [[ntKeys, ntTypes], setNtKeysAndTypes] = useState<KeysAndTypes>([
    [],
    {},
  ])
  useAllNTKeys(setNtKeysAndTypes)

  const selectedWidgetType =
    selectedWidget !== undefined
      ? schema.tabs[selectedWidget.tabIndex]?.widgets[
          selectedWidget.widgetIndex
        ]?.type
      : undefined
  const selectedWidgetSource =
    selectedWidget !== undefined
      ? schema.tabs[selectedWidget.tabIndex]?.widgets[
          selectedWidget.widgetIndex
        ]?.source
      : undefined

  const supportedWidgetTypes = (selectedWidgetType !== undefined
    ? widgets[selectedWidgetType]?.supportedTypes
    : ["undefined"]) ?? ["undefined"]

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
      }}
    >
      <div style={{ flex: "none", textAlign: "center" }}>
        <h1>Sand</h1>
        <SegmentedControl
          value={mode}
          onChange={setMode}
          data={[
            {
              label: <IconAndText icon="fa-solid fa-play" text="Play" />,
              value: Mode.Play,
            },
            {
              label: <IconAndText icon="fa-solid fa-brush" text="Edit" />,
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Select
                    label="Type"
                    style={{ width: "100%" }}
                    value={selectedWidgetType}
                    disabled={
                      selectedWidget === undefined ||
                      selectedWidget.tabIndex >= schema.tabs.length ||
                      selectedWidget.widgetIndex >=
                        schema.tabs[selectedWidget.tabIndex].widgets.length
                    }
                    data={Object.keys(widgets)
                      .map((widgetType) => ({
                        label: typeToTitle(widgetType),
                        value: widgetType,
                        group:
                          ntTypes[selectedWidgetSource] === undefined ||
                          widgets[widgetType].supportedTypes?.includes(
                            ntTypes[selectedWidgetSource]
                          )
                            ? "Suitable Types"
                            : "Unsuitable Types",
                      }))
                      .sort((a, b) => a.group.localeCompare(b.group))}
                    onChange={(newType) => {
                      if (newType !== null && selectedWidget !== undefined) {
                        setSchema((schema) => {
                          schema.tabs[selectedWidget.tabIndex].widgets[
                            selectedWidget.widgetIndex
                          ].type = newType
                          return { ...schema }
                        })
                      }
                    }}
                  />
                  <Autocomplete
                    label="Source"
                    data={Object.keys(ntTypes).filter(
                      (key) =>
                        supportedWidgetTypes === undefined ||
                        (supportedWidgetTypes.includes(ntTypes[key]) &&
                          !key.includes("/."))
                    )}
                    style={{ marginTop: 10, width: "100%" }}
                    value={selectedWidgetSource}
                    disabled={
                      selectedWidget === undefined ||
                      selectedWidget.tabIndex >= schema.tabs.length ||
                      selectedWidget.widgetIndex >=
                        schema.tabs[selectedWidget.tabIndex].widgets.length
                    }
                    onChange={(newSource) => {
                      if (selectedWidget) {
                        setSchema((schema) => {
                          schema.tabs[selectedWidget.tabIndex].widgets[
                            selectedWidget.widgetIndex
                          ].source = newSource
                          return { ...schema }
                        })
                      }
                    }}
                    limit={Number.POSITIVE_INFINITY}
                  />
                  {ntTypes[selectedWidgetSource] !== undefined && (
                    <Badge style={{ marginTop: 10 }}>
                      {ntTypes[selectedWidgetSource]}
                    </Badge>
                  )}
                  {ntTypes[selectedWidgetSource] === undefined ||
                    supportedWidgetTypes.includes(
                      ntTypes[selectedWidgetSource]
                    ) || (
                      <Alert
                        title="Unsuitable Widget Selected"
                        color="yellow"
                        style={{ marginTop: 20 }}
                      >
                        Widget '{typeToTitle(selectedWidgetType)}' is unsuitable
                        for type '{ntTypes[selectedWidgetSource]}'. This may
                        cause weird issues
                      </Alert>
                    )}
                </div>
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
          </Accordion>
        )}
      </div>
      <div style={{ flex: "none", textAlign: "center" }}>
        <SegmentedControl
          value={colorScheme}
          onChange={setColorScheme}
          data={[
            {
              label: <IconAndText icon="fa-solid fa-sun" text="Light" />,
              value: "light",
            },
            {
              label: <IconAndText icon="fa-solid fa-moon" text="Dark" />,
              value: "dark",
            },
          ]}
        />
        <ConnectionIndicator connected={connected} />
      </div>
    </div>
  )
}

export default Sidebar
