import React from "react"

interface WidgetProps {
  source?: string
  props?: {
    [key: string]: any
  }
}

interface Widget extends React.FC<WidgetProps> {
  supportedTypes?: string[]
  propsInfo?: {
    [key: string]: {
      type: "string" | "int" | "double" | "boolean" | "color" | "select"
      default?: string | number | boolean
      placeholder?: string
      choices?: string[]
    }
  }
}

export const getOrDefault = (
  props: { [key: string]: any },
  widget: Widget,
  key: string
) => {
  if (props === undefined || props[key] === undefined) {
    return widget.propsInfo[key].default
  }

  return props[key]
}

export default Widget
