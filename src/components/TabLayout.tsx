import { Tabs } from "@mantine/core"
import React, { useEffect, useState } from "react"
import Schema, {
  addTab,
  addWidget,
  removeWidget,
  setLayouts,
  setTabName,
  setTitle,
  updateWidgetInfo,
  updateWidgetInfoUsingCurrent,
  WidgetSelector,
} from "../models/Schema"
import { useNTGlobalListener, useNTKey } from "../hooks"
import GridLayout from "react-grid-layout"
import Mode from "../models/Mode"
import WidgetCell from "./WidgetCell"
import widgets, { typeToTitle } from "../widgets"

interface Props {
  mode: Mode
  schema: Schema
  setSchema: React.Dispatch<React.SetStateAction<Schema>>
  modify?: (selector: WidgetSelector) => void
  selectedWidget: WidgetSelector | undefined
  isModifying: boolean
}

const TabLayout: React.FC<Props> = ({
  mode,
  schema,
  setSchema,
  modify,
  selectedWidget,
  isModifying,
}) => {
  const [activeTab, setActiveTab] = useNTKey<string>("/Sand/ActiveTab", "0")
  const [robotSetTabs] = useNTKey<string[]>("/Shuffleboard/.metadata/Tabs", [])
  const [robotSetTabName] = useNTKey<string>(
    "/Shuffleboard/.metadata/Selected",
    ""
  )

  useNTGlobalListener((key, value, isNew) => {
    if (isNew && key.startsWith("/Shuffleboard") && !key.includes("/.")) {
      const [tabName, valueName] = key.substring(14).split("/")

      updateWidgetInfo(setSchema, tabName, {
        source: `/Shuffleboard/${tabName}/${valueName}`,
        title: valueName,
      })
    } else if (key.startsWith("/Shuffleboard/.metadata")) {
      const split = key.substring(24).split("/")
      if (split.length === 3) {
        const [tabName, valueName] = split
        const source = `/Shuffleboard/${tabName}/${valueName}`
        if (split[2] === "Size") {
          const [w, h]: [number, number] = value
          updateWidgetInfo(setSchema, tabName, {
            source,
            w: w,
            h: h,
          })
        } else if (split[2] === "Position") {
          const [x, y]: [number, number] = value
          updateWidgetInfo(setSchema, tabName, {
            source,
            x: x,
            y: y,
          })
        } else if (split[2] === "PreferredComponent") {
          updateWidgetInfo(setSchema, tabName, {
            source,
            type: value,
          })
        }
      } else if (split[2] === "Properties" && split.length === 4) {
        const [tabName, valueName, _, key] = split
        updateWidgetInfoUsingCurrent(
          setSchema,
          tabName,
          `/Shuffleboard/${tabName}/${valueName}`,
          (current) => ({
            ...current,
            props: { ...current.props, [key]: value },
          })
        )
      }
    }
  })

  useEffect(() => {
    const index = schema.tabs.findIndex((tab) => tab.name === robotSetTabName)
    if (index !== -1) {
      setActiveTab(index.toString())
    }
  }, [robotSetTabName])

  useEffect(() => {
    for (const tab of robotSetTabs) {
      if (!schema.tabs.some((t) => t.name === tab)) {
        addTab(setSchema, tab)
      }
    }
  }, [robotSetTabs])

  if (schema.tabs.length === 0) {
    return <></>
  }

  return (
    <Tabs
      value={activeTab}
      onTabChange={setActiveTab}
      style={{ height: "100%" }}
      styles={{ panel: { height: "100%" } }}
    >
      <Tabs.List>
        {schema.tabs.map((tab, tabIndex) => (
          <Tabs.Tab key={tabIndex} value={tabIndex.toString()}>
            <p
              style={{
                display: "inline",
                userSelect: "text",
                outline: 0,
                cursor: mode === Mode.Edit ? "text" : "pointer",
                height: "100%",
              }}
              onBlur={(event) => {
                setTabName(setSchema, tabIndex, event.currentTarget.textContent)
              }}
              contentEditable={mode === Mode.Edit}
              suppressContentEditableWarning
            >
              {tab.name}
            </p>
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {schema.tabs.map((tab, tabIndex) => (
        <Tabs.Panel value={tabIndex.toString()} key={tabIndex}>
          <GridLayout
            compactType={null}
            preventCollision={true}
            isResizable={mode === Mode.Edit}
            isDraggable={mode === Mode.Edit}
            isDroppable={true}
            cols={tab.columns}
            rowHeight={124}
            maxRows={6}
            width={1750}
            style={{ height: "100%" }}
            onLayoutChange={(layouts) =>
              setLayouts(setSchema, tabIndex, layouts)
            }
            onDrop={(layout, item, event) => {
              addWidget(setSchema, tabIndex, {
                x: item.x,
                y: item.y,
                w: 1,
                h: 1,
                title: typeToTitle(localStorage.getItem("WidgetType")),
                type: localStorage.getItem("WidgetType"),
                source: "",
                props: {},
              })
            }}
            layout={tab.widgets.map((widget, widgetIndex) => ({
              i: widgetIndex.toString(),
              x: widget.x,
              y: widget.y,
              w: widget.w,
              h: widget.h,
            }))}
          >
            {tab.widgets.map((widget, widgetIndex) => {
              const WidgetComponent = widgets[widget.type]

              return (
                <div
                  key={widgetIndex}
                  style={{
                    width: "100%",
                    height: "100%",
                    transitionDuration: "0s",
                  }}
                >
                  <WidgetCell
                    expand
                    mode={mode}
                    title={widget.title}
                    remove={() =>
                      removeWidget(setSchema, tabIndex, widgetIndex)
                    }
                    highlighted={
                      isModifying &&
                      selectedWidget !== undefined &&
                      selectedWidget.tabIndex === tabIndex &&
                      selectedWidget.widgetIndex === widgetIndex
                    }
                    modify={() => modify({ tabIndex, widgetIndex })}
                    setTitle={(title) =>
                      setTitle(setSchema, tabIndex, widgetIndex, title)
                    }
                  >
                    {WidgetComponent !== undefined && (
                      <WidgetComponent
                        source={widget.source}
                        props={widget.props}
                      />
                    )}
                  </WidgetCell>
                </div>
              )
            })}
          </GridLayout>
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}

export default TabLayout
