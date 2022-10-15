import React from "react"
import Mode from "../models/Mode"
import widgets, { typeToTitle } from "../widgets"
import WidgetCell from "./WidgetCell"

const WidgetDisplay = () => {
  return (
    <div>
      {Object.keys(widgets).map((widgetType) => {
        const WidgetComponent = widgets[widgetType]

        return (
          <div
            style={{ cursor: "grab" }}
            key={widgetType}
            onDragStart={() => localStorage.setItem("WidgetType", widgetType)}
            draggable
          >
            <WidgetCell title={typeToTitle(widgetType)} mode={Mode.Play}>
              <WidgetComponent />
            </WidgetCell>
          </div>
        )
      })}
    </div>
  )
}

export default WidgetDisplay
