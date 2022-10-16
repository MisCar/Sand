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
    [key: string]: "string" | "int"
  }
}

export default Widget
