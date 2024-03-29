import { Button, Tabs } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { confirm } from "@tauri-apps/api/dialog"
import React, { useEffect } from "react"
import GridLayout from "react-grid-layout"
import { useNTGlobalListener, useNTKey } from "../hooks"
import Mode from "../models/Mode"
import Schema, {
  addTab,
  addWidget,
  removeTab,
  removeWidget,
  setLayouts,
  setTabName,
  setTitle,
  updateWidgetInfo,
  updateWidgetInfoUsingCurrent,
  WidgetSelector,
} from "../models/Schema"
import widgets from "../widgets"
import WidgetCell from "./WidgetCell"

interface Props {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  mode: Mode
  schema: Schema
  setSchema: React.Dispatch<React.SetStateAction<Schema>>
  modify?: (selector: WidgetSelector) => void
  selectedWidget: WidgetSelector | undefined
  isModifying: boolean
}

/** This is some magic number which looks good.
 * It's probably around the tab list height, as the height given by useElementSize includes that.
 * If you wish to modify this, you'll probably decrease the app's height until it limits the tab's grid size.
 */
const GRID_PADDING = 135

const TabLayout: React.FC<Props> = ({
  mode,
  schema,
  setSchema,
  modify,
  selectedWidget,
  isModifying,
  activeTab,
  setActiveTab,
}) => {
  const [robotSetTabs] = useNTKey<string[]>("/Shuffleboard/.metadata/Tabs", [])
  const [robotSetTabName] = useNTKey<string>(
    "/Shuffleboard/.metadata/Selected",
    ""
  )
  const { ref, width, height } = useElementSize()

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

  if (schema.tabs.length === 0 && mode !== Mode.Edit) {
    return <></>
  }

  return (
    <Tabs
      value={activeTab}
      onTabChange={setActiveTab}
      style={{ height: "100%", width: "100%", padding: 5 }}
      styles={{ panel: { height: "100%" }, tabsList: { minHeight: 36 } }}
      ref={ref}
    >
      <Tabs.List>
        {schema.tabs.map((tab, tabIndex) => (
          <Tabs.Tab key={tabIndex} value={tabIndex.toString()}>
            <p
              style={{
                display: "inline",
                userSelect: "text",
                WebkitUserSelect: "text",
                outline: 0,
                cursor: mode === Mode.Edit ? "text" : "pointer",
                height: "100%",
              }}
              onBlur={(event) => {
                setTabName(setSchema, tabIndex, event.currentTarget.textContent)
              }}
              contentEditable={mode === Mode.Edit}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  event.currentTarget.blur()
                }
              }}
              suppressContentEditableWarning
            >
              {tab.name}
            </p>
            {mode === Mode.Edit && (
              <i
                className="fa-solid fa-trash"
                style={{ marginLeft: 10 }}
                onClick={async () => {
                  if (
                    await confirm(
                      `Are you sure you want to delete '${tab.name}'?`
                    )
                  ) {
                    removeTab(setSchema, tabIndex)
                  }
                }}
              />
            )}
          </Tabs.Tab>
        ))}
        {mode === Mode.Edit && (
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => addTab(setSchema)}
            size="xs"
            leftIcon={<i className="fa-solid fa-plus" />}
          >
            New Tab
          </Button>
        )}
      </Tabs.List>
      {schema.tabs.map((tab, tabIndex) => {
        if (tabIndex.toString() !== activeTab) {
          return <React.Fragment key={tabIndex}></React.Fragment>
        }

        let maxRow =
          tab.widgets?.length === 0
            ? 9999999
            : tab.widgets[0].y + tab.widgets[0].h
        for (let i = 1; i < tab.widgets.length; i++) {
          maxRow = Math.max(maxRow, tab.widgets[i].y + tab.widgets[i].h)
        }

        return (
          <Tabs.Panel
            value={tabIndex.toString()}
            key={tabIndex}
            style={{ backgroundColor: "var(--tab-background)" }}
          >
            <GridLayout
              compactType={null}
              preventCollision={true}
              isResizable={mode === Mode.Edit}
              isDraggable={mode === Mode.Edit}
              isDroppable={true}
              cols={tab.columns}
              rowHeight={
                tab.gridSize ??
                Math.min(width / tab.columns, (height - GRID_PADDING) / maxRow)
              }
              maxRows={Math.max(
                Math.floor(height / (width / tab.columns)) - 1,
                1
              )}
              width={
                tab.gridSize
                  ? tab.gridSize * tab.columns
                  : Math.min(
                      width,
                      ((height - GRID_PADDING) / maxRow) * tab.columns
                    )
              }
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
                  title: localStorage.getItem("WidgetTitle"),
                  type: localStorage.getItem("WidgetType"),
                  source: localStorage.getItem("WidgetSource"),
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
        )
      })}
    </Tabs>
  )
}

export default TabLayout
