import { useMantineTheme } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { useNTKey } from "../hooks"
import Widget from "../models/Widget"
import Cone from "./images/ChargeUpCone"
import Cube from "./images/ChargeUpCube"

const ChargeUpGrid: Widget = ({ source, props }) => {
  const theme = useMantineTheme()
  const { ref, width, height } = useElementSize()
  const size = Math.min(width / 9, height / 3) * 0.9

  const [unsafeInfos, setInfos] = useNTKey<number[]>(source)
  const infos = unsafeInfos ?? [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ]

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
        {[0, 1, 2].map((row) => {
          return (
            <tr
              key={row}
              style={{
                border: "1px solid " + borderColor,
                borderCollapse: "collapse",
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((column) => {
                return (
                  <td
                    key={column}
                    width={size}
                    height={size}
                    style={{
                      margin: 0,
                      padding: 0,
                      border: "1px solid " + borderColor,
                      borderCollapse: "collapse",
                    }}
                  >
                    <img
                      src={
                        infos[9 * row + column] == 1
                          ? Cone
                          : infos[9 * row + column] == 2
                          ? Cube
                          : undefined
                      }
                      onClick={() => {
                        infos[9 * row + column] =
                          (infos[9 * row + column] + 1) % 3
                        setInfos(infos)
                      }}
                      style={{ maxHeight: size, maxWidth: size }}
                    />
                  </td>
                )
              })}
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default ChargeUpGrid
