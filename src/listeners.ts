/** Code to interact with Tauri events */
import { listen } from "@tauri-apps/api/event"
import { open, save } from "@tauri-apps/api/dialog"
import { fs } from "@tauri-apps/api"
import { cacheDir, join } from "@tauri-apps/api/path"

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

  const text = await fs.readTextFile(file)
  // @ts-ignore
  window.setSchema(text)
})

listen("save", async () => {
  const currentFile = await join(await cacheDir(), "Sand", "current.json")
  // @ts-ignore
  fs.writeTextFile(currentFile, window.getSchema())
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
