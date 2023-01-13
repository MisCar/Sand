import { useMantineTheme } from "@mantine/core"
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from "chart.js"
import { useEffect } from "react"
import { Line } from "react-chartjs-2"
import { useLast } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"
import NetworkTables from "../thirdparty/networktables"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title)

const Graph: Widget = ({ source, props }) => {
  const [values, addValue] = useLast<number>(
    getOrDefault(props, Graph, "valueCount")
  )
  const theme = useMantineTheme()

  useEffect(() => {
    const interval = window.setInterval(() => {
      const newValue: number = NetworkTables.getValue(source, 0)
      // This could probably be smarter
      addValue(
        parseFloat(newValue.toFixed(getOrDefault(props, Graph, "precision")))
      )
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
          yAxis: { min: props?.minValue, max: props?.maxValue },
        },
        animation: false,
      }}
    />
  )
}

Graph.supportedTypes = ["number"]
Graph.propsInfo = {
  valueCount: {
    type: "int",
    default: 2000,
  },
  minValue: {
    type: "double",
  },
  maxValue: {
    type: "double",
  },
  precision: {
    type: "int",
    default: 6,
  },
}

export default Graph
