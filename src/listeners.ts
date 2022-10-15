/** Code to interact with Tauri events */
import { listen } from "@tauri-apps/api/event"
import { open, save } from "@tauri-apps/api/dialog"
import { fs } from "@tauri-apps/api"
import { configDir, join } from "@tauri-apps/api/path"

export const DEFAULT_FILE = "current.json"

export const restoreFile = async (file: string) => {
  const text = await fs.readTextFile(file)
  // @ts-ignore
  window.setSchema(text)
}

listen("open", async (event) => {
  const file = (await open({
    multiple: false,
    filters: [
      {
        name: "JSON",
        extensions: ["json"],
      },
    ],
  })) as string

  if (file) {
    await restoreFile(file)
  }
})

listen("save", () => {
  // @ts-ignore
  localStorage.setItem("Schema", window.getSchema())
})

listen("saveas", async () => {
  const file = await save({
    filters: [
      {
        name: "JSON",
        extensions: ["json"],
      },
    ],
  })

  // @ts-ignore
  fs.writeTextFile(file, window.getSchema())
})
