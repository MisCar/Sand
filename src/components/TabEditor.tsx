import { NumberInput } from "@mantine/core"
import { useNTKey } from "../hooks"
import Schema from "../models/Schema"

interface Props {
  schema: Schema
  setSchema: React.Dispatch<React.SetStateAction<Schema>>
  activeTab: string
}

const TabEditor: React.FC<Props> = ({ schema, setSchema, activeTab }) => {
  const tabIndex = parseInt(activeTab, 10)

  return (
    <>
      <NumberInput
        label="Columns"
        icon={<i className="fa-solid fa-table-columns" />}
        value={schema.tabs[tabIndex].columns}
        onChange={(value) =>
          setSchema((schema) => {
            schema.tabs[tabIndex].columns = value
            return { ...schema }
          })
        }
      />
      <NumberInput
        label="Grid Size"
        style={{ marginTop: 10 }}
        icon={<i className="fa-solid fa-maximize" />}
        value={schema.tabs[tabIndex]?.gridSize}
        onChange={(value) =>
          setSchema((schema) => {
            schema.tabs[tabIndex].gridSize = value
            return { ...schema }
          })
        }
      />
    </>
  )
}

export default TabEditor
