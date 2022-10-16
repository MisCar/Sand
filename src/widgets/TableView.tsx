import { Table } from "@mantine/core"
import { useAllNTKeys } from "../hooks"
import Widget from "../models/Widget"

const TableView: Widget = ({ source, props }) => {
  const [keys] = useAllNTKeys()

  const sourceWithSlash =
    source === undefined
      ? "//"
      : source[source.length - 1] === "/"
      ? source
      : source + "/"

  return (
    <Table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {keys
          .filter((key) => key.startsWith(sourceWithSlash))
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
  )
}

TableView.supportedTypes = ["all"]

export default TableView
