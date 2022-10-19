import { Button, Table, TextInput } from "@mantine/core"
import Schema, { addShortcut, updateShortcut } from "../models/Schema"
import NTAutocomplete from "./NTAutocomplete"

interface Props {
  schema: Schema
  setSchema: React.Dispatch<React.SetStateAction<Schema>>
}

const ShortcutManager: React.FC<Props> = ({ schema, setSchema }) => {
  return (
    <>
      <Table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Shortcut</th>
            <th>NT Key</th>
          </tr>
        </thead>
        <tbody>
          {(schema?.shortcuts ?? []).map((shortcut, shortcutIndex) => (
            <tr>
              <td>
                <TextInput
                  value={shortcut.keyboard}
                  onChange={(event) =>
                    updateShortcut(setSchema, shortcutIndex, {
                      keyboard: event.currentTarget.value,
                    })
                  }
                />
              </td>
              <td>
                <NTAutocomplete
                  value={shortcut.ntKey}
                  onChange={(newValue) =>
                    updateShortcut(setSchema, shortcutIndex, {
                      ntKey: newValue,
                    })
                  }
                  supportedWidgetTypes={["boolean"]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        leftIcon={<i className="fa-solid fa-plus" />}
        style={{ width: "100%", marginTop: 10 }}
        onClick={() => addShortcut(setSchema)}
      >
        New Shortcut
      </Button>
    </>
  )
}

export default ShortcutManager
