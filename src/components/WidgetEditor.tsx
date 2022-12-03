import { Alert, Badge, Select, TextInput } from "@mantine/core"
import React, { useState } from "react"
import { KeysAndTypes, useAllNTKeys } from "../hooks"
import Schema, {
  setTitle,
  updateWidgetProps,
  WidgetSelector,
} from "../models/Schema"
import widgets, { typeToTitle } from "../widgets"
import NTAutocomplete from "./NTAutocomplete"
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
  const selectedWidgetTitle =
    selectedWidget !== undefined
      ? schema.tabs[selectedWidget.tabIndex]?.widgets[
          selectedWidget.widgetIndex
        ]?.title
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
      <TextInput
        label="Title"
        icon={<i className="fa-solid fa-heading" />}
        value={selectedWidgetTitle}
        onChange={(event) =>
          setTitle(
            setSchema,
            selectedWidget.tabIndex,
            selectedWidget.widgetIndex,
            event.currentTarget.value
          )
        }
      />
      <Select
        icon={<i className="fa-solid fa-cube" />}
        label="Type"
        style={{ marginTop: 10, width: "100%" }}
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
      <NTAutocomplete
        label="Source"
        icon={<i className="fa-solid fa-wifi" />}
        value={selectedWidgetSource}
        style={{ marginTop: 10, width: "100%" }}
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
        disabled={
          selectedWidget === undefined ||
          selectedWidget.tabIndex >= schema.tabs.length ||
          selectedWidget.widgetIndex >=
            schema.tabs[selectedWidget.tabIndex].widgets.length
        }
        supportedWidgetTypes={supportedWidgetTypes}
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

      <PropEditor
        widget={widgets[selectedWidgetType]}
        currentProps={
          schema.tabs[selectedWidget.tabIndex]?.widgets[
            selectedWidget.widgetIndex
          ]?.props
        }
        setProp={(key, value) =>
          updateWidgetProps(setSchema, selectedWidget, key, value)
        }
      />
    </div>
  )
}

export default WidgetEditor
