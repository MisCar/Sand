import { Kbd, Table, TextInput } from "@mantine/core"
import { useState } from "react"
import { Shortcut, Shortcuts } from "shortcuts"

const shortcuts = new Shortcuts()

let disposer: () => void

const HotkeyManager = () => {
  const [hotkeys, setHotkeys] = useState<[string, string][]>([
    ["CmdOrCtrl+A", "/MisCar/Align"],
  ])
  const [selected, setSelected] = useState<number>()

  const resetShortcuts = () => {
    shortcuts.reset()
    shortcuts.add(
      hotkeys.map(([keys, ntKey]) => ({
        shortcut: keys,
        handler: () => NetworkTables.setValue(ntKey, true),
      }))
    )
    hotkeys.forEach(([keys, ntKey]) => NetworkTables.setValue(ntKey, false))
  }

  const recordFor = (index: number) => {
    setSelected(index)
    disposer = shortcuts.record((shortcut) => {
      const split = shortcut.split(" ")
      hotkeys[index] = [
        split[split.length - 1]
          .replace("Ctrl", "CmdOrCtrl")
          .replace("Cmd", "CmdOrCtrl"),
        hotkeys[index][1],
      ]
      setHotkeys([...hotkeys])
      disposer()
      setSelected(undefined)
      resetShortcuts()
    })
  }

  return (
    <Table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Hotkey</th>
          <th>NT Key</th>
        </tr>
      </thead>
      <tbody>
        {hotkeys.map(([keys, ntKey], index) => (
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
                value={hotkeys[index][1]}
                onChange={(event) => {
                  const value = event.currentTarget.value
                  setHotkeys((hotkeys) => {
                    hotkeys[index][1] = value
                    return [...hotkeys]
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

export default HotkeyManager
