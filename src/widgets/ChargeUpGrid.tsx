import { useMantineTheme } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { useEffect } from "react"
import { useNTKey } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"
import Cone from "./images/ChargeUpCone"
import Cube from "./images/ChargeUpCube"

const ChargeUpGrid: Widget = ({ source, props }) => {
  const theme = useMantineTheme()
  const { ref, width, height } = useElementSize()

  const columns: number = getOrDefault(props, ChargeUpGrid, "columns")

  const size = Math.min(width / columns, height / 3) * 0.9

  const [infos, setInfos] = useNTKey<number[]>(source, Array(columns).fill(0))

  useEffect(() => {
    if (infos.length !== columns * 3) {
      setInfos(Array(columns * 3).fill(0))
    }
  }, [columns])

  const borderColor = theme.colorScheme === "dark" ? "white" : "black"

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex" }}>
      <table
        style={{
          margin: "auto",
          border: "1px solid " + borderColor,
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {[0, 1, 2].map((row) => {
            return (
              <tr
                key={row}
                style={{
                  border: "1px solid " + borderColor,
                  borderCollapse: "collapse",
                }}
              >
                {[...Array(columns).keys()].map((column) => {
                  return (
                    <td
                      key={column}
                      width={size}
                      height={size}
                      style={{
                        margin: 0,
                        padding: 0,
                        border: "1px solid " + borderColor,
                        borderRight:
                          (columns === 9 && [2, 5].includes(column)
                            ? "5px"
                            : "1px") +
                          " solid " +
                          borderColor,
                        borderCollapse: "collapse",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (row !== 2) {
                          if (column % 3 === 1) {
                            infos[columns * row + column] =
                              1 - infos[columns * row + column]
                            setInfos([...infos])
                            return
                          }

                          infos[columns * row + column] =
                            2 - infos[columns * row + column]
                          setInfos([...infos])
                          return
                        }
                        infos[columns * row + column] =
                          (infos[columns * row + column] + 1) % 3
                        setInfos([...infos])
                      }}
                    >
                      <img
                        src={
                          infos[columns * row + column] === 1
                            ? Cube
                            : infos[columns * row + column] === 2
                            ? Cone
                            : ""
                        }
                        style={{
                          maxHeight: size,
                          maxWidth: size,
                          display:
                            infos[columns * row + column] === 0
                              ? "none"
                              : undefined,
                          userSelect: "none",
                          WebkitUserSelect: "none",
                        }}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

ChargeUpGrid.propsInfo = {
  columns: {
    type: "int",
    default: 9,
  },
}

ChargeUpGrid.supportedTypes = ["number[]"]

export default ChargeUpGrid
