import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from "chart.js"
import Widget from "../models/Widget"
import { useLast } from "../hooks"
import { useMantineTheme } from "@mantine/core"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title)

const Graph: Widget = ({ source, props }) => {
  const [values, addValue] = useLast<number>(250)
  const theme = useMantineTheme()

  useEffect(() => {
    const interval = window.setInterval(() => {
      const newValue = NetworkTables.getValue(source, 0)
      addValue(newValue)
    }, 20)
    return () => window.clearInterval(interval)
  }, [source])

  const color = theme.colorScheme === "dark" ? "white" : "black"

  return (
    <Line
      data={{
        labels: values.map((v, index) => index.toString()),
        datasets: [
          {
            label: "Dataset 1",
            data: values,
            borderColor: color,
            backgroundColor: color,
          },
        ],
      }}
      options={{
        scales: {
          xAxis: { display: false },
        },
        animation: false,
      }}
    />
  )
}

Graph.supportedTypes = ["number"]

export default Graph
