/** Code to interact with Tauri events */
import { fs } from "@tauri-apps/api"
import { open, save } from "@tauri-apps/api/dialog"
import { listen } from "@tauri-apps/api/event"
import { createDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { cacheDir, join } from "@tauri-apps/api/path"
import Schema from "./models/Schema"

export const getConfigDir = async () => {
  // Config dir has spaces on macOS which causes issues
  const dir = await cacheDir()
  const result = await join(dir, "Sand")
  return result
}

export const getDefaultFile = async () => {
  const configDir = await getConfigDir()
  const result = await join(configDir, "current.json")
  return result
}

export interface Settings {
  robotAddress?: string
  themeColor?: string
}

export const getSettings = async (): Promise<Settings | undefined> => {
  const configDir = await getConfigDir()
  const settingsFile = await join(configDir, "settings.json")
  const contents = await readTextFile(settingsFile)
  return JSON.parse(contents)
}

export const setSettings = async (settings: Settings) => {
  const configDir = await getConfigDir()
  const settingsFile = await join(configDir, "settings.json")
  await writeTextFile(settingsFile, JSON.stringify(settings))
}

export const restoreFile = async (file: string) => {
  const text = await fs.readTextFile(file)
  // @ts-ignore
  window.setSchema(text)
}

listen("open", async () => {
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

listen("import", async () => {
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
    const text = await readTextFile(file)
    const json = JSON.parse(text)
    console.log(json)
    const schema: Schema = {
      tabs: json.tabPane.map((tab: any) => ({
        name: tab.title,
        columns: 13,
        gridSize: tab.gridSize,
        widgets: Object.keys(tab.widgetPane.tiles).map((position: string) => {
          const [x, y] = position.split(",")
          const tile = tab.widgetPane.tiles[position]
          return {
            title: tile.content._title,
            type: tile.content._type.replace(/ /g, ""),
            source: tile.content._source0.split("://")[1],
            x: parseInt(x, 10),
            y: parseInt(y, 10),
            w: tile.size[0],
            h: tile.size[1],
          }
        }),
      })),
    }
    // @ts-ignore
    window.setSchema(JSON.stringify(schema))
  }
})

listen("save", async () => {
  const configDir = await getConfigDir()
  await createDir(configDir, { recursive: true })
  const defaultFile = await getDefaultFile()
  // @ts-ignore
  await writeTextFile(defaultFile, window.getSchema())
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
