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

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex" }}>
      <table
        style={{
          margin: "auto",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {[0, 1, 2].map((row) => {
            return (
              <tr
                key={row}
                style={{
                  borderCollapse: "collapse",
                }}
              >
                {[...Array(columns).keys()].map((column) => {
                  const borderColor =
                    theme.colorScheme === "dark" ? "white" : "black"

                  const currentValue = infos[columns * row + column]
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
                        backgroundColor:
                          row === 2
                            ? undefined
                            : column % 3 === 1
                            ? "#b434eb33"
                            : "#ffea0033",
                        borderCollapse: "collapse",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (row !== 2) {
                          // High row
                          if (column % 3 === 1) {
                            // Cube column
                            if (currentValue === 0) {
                              infos[columns * row + column] = 4
                            } else if (currentValue === 4) {
                              infos[columns * row + column] = 1
                            } else {
                              infos[columns * row + column] = 0
                            }
                            setInfos([...infos])
                            return
                          }

                          // Cone column
                          if (currentValue === 0) {
                            infos[columns * row + column] = 5
                          } else if (currentValue === 5) {
                            infos[columns * row + column] = 2
                          } else {
                            infos[columns * row + column] = 0
                          }
                          setInfos([...infos])
                          return
                        }

                        if (currentValue === 0) {
                          infos[columns * row + column] = 4
                        } else if (currentValue === 4) {
                          infos[columns * row + column] = 5
                        } else if (currentValue === 5) {
                          infos[columns * row + column] = 1
                        } else if (currentValue === 1) {
                          infos[columns * row + column] = 2
                        } else {
                          infos[columns * row + column] = 0
                        }
                        setInfos([...infos])
                      }}
                    >
                      <img
                        src={
                          currentValue % 3 === 1
                            ? Cube
                            : currentValue % 3 === 2
                            ? Cone
                            : ""
                        }
                        style={{
                          maxHeight: size - 5,
                          maxWidth: size - 5,
                          display: currentValue === 0 ? "none" : undefined,
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          animation:
                            currentValue >= 3
                              ? "blink 0.75s steps(2, start) infinite"
                              : undefined,
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
