import { Alert, Autocomplete, Badge, Select } from "@mantine/core"
import React, { useState } from "react"
import { KeysAndTypes, useAllNTKeys } from "../hooks"
import Schema, { updateWidgetProps, WidgetSelector } from "../models/Schema"
import widgets, { typeToTitle } from "../widgets"
import PropEditor from "./PropEditor"

interface Props {
  selectedWidget: WidgetSelector
  schema: Schema
  setSchema: React.Dispatch<React.SetStateAction<Schema>>
}

const WidgetEditor: React.FC<Props> = ({
  selectedWidget,
  schema,
  setSchema,
}) => {
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

  const supportedWidgetTypes =
    (selectedWidgetType !== undefined
      ? widgets[selectedWidgetType]?.supportedTypes
      : []) ?? []

  return (
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
              ) ||
              widgets[widgetType].supportedTypes?.includes("all")
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
            supportedWidgetTypes.includes("all") ||
            (supportedWidgetTypes.includes(ntTypes[key]) && !key.includes("/."))
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
        <Badge style={{ marginTop: 10 }}>{ntTypes[selectedWidgetSource]}</Badge>
      )}
      {!supportedWidgetTypes.includes("all") &&
        ntTypes[selectedWidgetSource] !== undefined &&
        !supportedWidgetTypes.includes(ntTypes[selectedWidgetSource]) && (
          <Alert
            title="Unsuitable Widget Selected"
            color="yellow"
            style={{ marginTop: 20 }}
          >
            Widget '{typeToTitle(selectedWidgetType)}' is unsuitable for type '
            {ntTypes[selectedWidgetSource]}'. This may cause weird issues.
          </Alert>
        )}

      {Object.keys(widgets[selectedWidgetType]?.propsInfo ?? {}).length !==
        0 && <hr style={{ width: "100%" }} />}
      <PropEditor
        widget={widgets[selectedWidgetType]}
        currentProps={
          schema.tabs[selectedWidget.tabIndex]?.widgets[
            selectedWidget.widgetIndex
          ].props
        }
        setProp={(key, value) =>
          updateWidgetProps(setSchema, selectedWidget, key, value)
        }
      />
    </div>
  )
}

export default WidgetEditor
