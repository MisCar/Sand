import { Table } from "@mantine/core"
import { useAllNTKeys } from "../hooks"
import Widget, { getOrDefault } from "../models/Widget"

const TableView: Widget = ({ source, props }) => {
  const [keys] = useAllNTKeys()

  const sourceWithSlash =
    source === undefined
      ? "//"
      : source[source.length - 1] === "/"
      ? source
      : source + "/"

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {keys
            .filter(
              (key) =>
                key.startsWith(sourceWithSlash) &&
                (getOrDefault(props, TableView, "showHidden") ||
                  !key.includes("/."))
            )
            .map((key) => {
              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{JSON.stringify(NetworkTables.getValue(key))}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    </div>
  )
}

TableView.supportedTypes = ["all"]

TableView.propsInfo = {
  showHidden: {
    type: "boolean",
    default: true,
  },
}

export default TableView
