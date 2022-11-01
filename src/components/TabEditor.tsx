import { NumberInput, TextInput } from "@mantine/core"
import { useNTKey } from "../hooks"
import Schema from "../models/Schema"

interface Props {
  schema: Schema
  setSchema: React.Dispatch<React.SetStateAction<Schema>>
  activeTab: string
}

const TabEditor: React.FC<Props> = ({ schema, setSchema, activeTab }) => {
  const tabIndex = parseInt(activeTab, 10)

  if (schema.tabs[tabIndex] === undefined) {
    return <p>No tab selected.</p>
  }

  return (
    <>
      <TextInput
        label="Name"
        icon={<i className="fa-solid fa-heading" />}
        value={schema.tabs[tabIndex].name}
        onChange={(event) =>
          setSchema((schema) => {
            schema.tabs[tabIndex].name = event.currentTarget.value
            return { ...schema }
          })
        }
      />
      <NumberInput
        label="Columns"
        style={{ marginTop: 10 }}
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
