import { Kbd, Table, TextInput } from "@mantine/core"
import { useState } from "react"
import { Shortcut, Shortcuts } from "shortcuts"

const shortcutController = new Shortcuts()

let disposer: () => void

const ShortcutManager = () => {
  const [shortcuts, setShortcuts] = useState<[string, string][]>([
    ["CmdOrCtrl+A", "/MisCar/Align"],
  ])
  const [selected, setSelected] = useState<number>()

  const resetShortcuts = () => {
    shortcutController.reset()
    shortcutController.add(
      shortcuts.map(([keys, ntKey]) => ({
        shortcut: keys,
        handler: () => NetworkTables.setValue(ntKey, true),
      }))
    )
    shortcuts.forEach(([keys, ntKey]) => NetworkTables.setValue(ntKey, false))
  }

  const recordFor = (index: number) => {
    setSelected(index)
    disposer = shortcutController.record((shortcut) => {
      const split = shortcut.split(" ")
      shortcuts[index] = [
        split[split.length - 1]
          .replace("Ctrl", "CmdOrCtrl")
          .replace("Cmd", "CmdOrCtrl"),
        shortcuts[index][1],
      ]
      setShortcuts([...shortcuts])
      disposer()
      setSelected(undefined)
      resetShortcuts()
    })
  }

  return (
    <Table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Shortcut</th>
          <th>NT Key</th>
        </tr>
      </thead>
      <tbody>
        {shortcuts.map(([keys, ntKey], index) => (
          <tr key={index}>
            <td style={{ width: "50%" }}>
              <Kbd
                style={{
                  cursor: "pointer",
                  fontSize: 18,
                  backgroundColor: index === selected ? "red" : undefined,
                  color: index === selected ? "white" : undefined,
                }}
                onClick={() => recordFor(index)}
              >
                {Shortcut.shortcut2symbols(keys)}
              </Kbd>
            </td>
            <td>
              <TextInput
                value={shortcuts[index][1]}
                onChange={(event) => {
                  const value = event.currentTarget.value
                  setShortcuts((s) => {
                    s[index][1] = value
                    return [...s]
                  })
                }}
                onBlur={resetShortcuts}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default ShortcutManager
