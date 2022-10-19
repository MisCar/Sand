import { Button, Select, Table, TextInput } from "@mantine/core"
import Schema, {
  addShortcut,
  removeShortcut,
  updateShortcut,
} from "../models/Schema"
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
            <th style={{ width: "22.5%" }}>Shortcut</th>
            <th>NT Key</th>
            <th style={{ width: "22.5%" }}>Mode</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(schema?.shortcuts ?? []).map((shortcut, shortcutIndex) => (
            <tr>
              <td>
                <TextInput
                  icon={<i className="fa-solid fa-keyboard" />}
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
                  icon={<i className="fa-solid fa-wifi" />}
                  value={shortcut.ntKey}
                  onChange={(newValue) =>
                    updateShortcut(setSchema, shortcutIndex, {
                      ntKey: newValue,
                    })
                  }
                  supportedWidgetTypes={["boolean"]}
                />
              </td>
              <td>
                <Select
                  value={shortcut.mode}
                  onChange={(newMode: "flip" | "set-true") =>
                    updateShortcut(setSchema, shortcutIndex, {
                      mode: newMode,
                    })
                  }
                  data={[
                    { label: "Flip", value: "flip" },
                    { label: "Set True", value: "set-true" },
                  ]}
                />
              </td>
              <td>
                <i
                  className="fa-solid fa-trash"
                  style={{ cursor: "pointer" }}
                  onClick={() => removeShortcut(setSchema, shortcutIndex)}
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
