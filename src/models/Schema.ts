import { Layout } from "react-grid-layout"

export interface WidgetInfo {
  title: string
  type: string
  source: string
  props: {
    [key: string]: any
  }
  x: number
  y: number
  w: number
  h: number
}

export interface Tab {
  name: string
  columns: number
  widgets: WidgetInfo[]
}

interface Schema {
  tabs: Tab[]
}

export default Schema

export interface WidgetSelector {
  tabIndex: number
  widgetIndex: number
}

export const setTabName = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  index: number,
  name: string
) => {
  setSchema((schema) => {
    schema.tabs[index].name = name
    return { ...schema }
  })
}

export const setLayouts = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  tabIndex: number,
  layouts: Layout[]
) => {
  setSchema((schema) => {
    for (const layout of layouts) {
      const widgetIndex = parseInt(layout.i, 10)

      if (!Number.isNaN(widgetIndex)) {
        schema.tabs[tabIndex].widgets[widgetIndex].x = layout.x
        schema.tabs[tabIndex].widgets[widgetIndex].y = layout.y
        schema.tabs[tabIndex].widgets[widgetIndex].w = layout.w
        schema.tabs[tabIndex].widgets[widgetIndex].h = layout.h
      }
    }
    return { ...schema }
  })
}

export const removeWidget = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  tabIndex: number,
  widgetIndex: number
) => {
  setSchema((schema) => {
    schema.tabs[tabIndex].widgets.splice(widgetIndex, 1)
    return { ...schema }
  })
}

export const addWidget = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  tabIndex: number,
  widget: WidgetInfo
) => {
  setSchema((schema) => {
    schema.tabs[tabIndex].widgets.push(widget)
    return { ...schema }
  })
}

export const setTitle = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  tabIndex: number,
  widgetIndex: number,
  title: string
): void => {
  setSchema((schema) => {
    schema.tabs[tabIndex].widgets[widgetIndex].title = title
    return { ...schema }
  })
}

export const setType = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  tabIndex: number,
  widgetIndex: number,
  type: string
): void => {
  setSchema((schema) => {
    schema.tabs[tabIndex].widgets[widgetIndex].type = type
    return { ...schema }
  })
}

export const addTab = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  title?: string
) => {
  setSchema((schema) => {
    schema.tabs.push({
      name: title ?? "Untitled",
      widgets: [],
      columns: 13,
    })
    return { ...schema }
  })
}

export interface PartialWidgetInfo extends Partial<WidgetInfo> {
  source: string
}

const fill = (partial: PartialWidgetInfo): WidgetInfo => {
  return {
    title: "",
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    type: "Label",
    props: {},
    ...partial,
  }
}

export const updateWidgetInfo = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  tabName: string,
  newInfo: PartialWidgetInfo
) => {
  setSchema((schema) => {
    const newInfoFilled = fill(newInfo)

    const tabIndex = schema.tabs.findIndex((tab) => tab.name === tabName)
    if (tabIndex === -1) {
      schema.tabs.push({
        name: tabName,
        widgets: [newInfoFilled],
        columns: 13,
      })
      return { ...schema }
    }

    // Widget already added
    const widgetIndex = schema.tabs[tabIndex].widgets.findIndex(
      (w) => w.source === newInfo.source
    )
    if (widgetIndex !== -1) {
      schema.tabs[tabIndex].widgets[widgetIndex] = {
        ...schema.tabs[tabIndex].widgets[widgetIndex],
        ...newInfo,
      }
      return { ...schema }
    }

    schema.tabs[tabIndex].widgets.push(newInfoFilled)

    return { ...schema }
  })
}

export const updateWidgetInfoUsingCurrent = (
  setSchema: React.Dispatch<React.SetStateAction<Schema>>,
  tabName: string,
  source: string,
  newInfo: (current?: WidgetInfo) => PartialWidgetInfo
) => {
  setSchema((schema) => {
    const tabIndex = schema.tabs.findIndex((tab) => tab.name === tabName)

    // Tab doesn't exist yet
    if (tabIndex === -1) {
      schema.tabs.push({
        name: tabName,
        widgets: [fill(newInfo())],
        columns: 13,
      })
      return { ...schema }
    }

    // Widget already exists
    const widgetIndex = schema.tabs[tabIndex].widgets.findIndex(
      (w) => w.source === source
    )
    if (widgetIndex !== -1) {
      const newInfoValue = newInfo(schema.tabs[tabIndex].widgets[widgetIndex])
      schema.tabs[tabIndex].widgets[widgetIndex] = {
        ...schema.tabs[tabIndex].widgets[widgetIndex],
        ...newInfoValue,
      }
      return { ...schema }
    }

    // Tab exists but widget doesn't
    schema.tabs[tabIndex].widgets.push(fill(newInfo()))

    return { ...schema }
  })
}
