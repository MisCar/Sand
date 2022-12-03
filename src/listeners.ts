/** Code to interact with Tauri events */
import { join } from "path"
import {
  cacheDir,
  createDir,
  listen,
  readTextFile,
  writeTextFile,
} from "./bridge"
import Schema from "./models/Schema"

export const getConfigDir = () => {
  const dir = cacheDir()
  const result = join(dir, "Sand")
  return result
}

export const getDefaultFile = () => {
  const configDir = getConfigDir()
  const result = join(configDir, "current.json")
  return result
}

export interface Settings {
  robotAddress?: string
  themeColor?: string
}

export const getSettings = async (): Promise<Settings | undefined> => {
  const configDir = await getConfigDir()
  const settingsFile = join(configDir, "settings.json")
  const contents = await readTextFile(settingsFile)
  return JSON.parse(contents)
}

export const setSettings = async (settings: Settings) => {
  const configDir = await getConfigDir()
  const settingsFile = join(configDir, "settings.json")
  await writeTextFile(settingsFile, JSON.stringify(settings))
}

export const restoreFile = async (file: string) => {
  const text = readTextFile(file)
  // @ts-ignore
  window.setSchema(text)
}

listen("open", async (event, text: string) => {
  // @ts-ignore
  window.setSchema(text)
})

listen("import", async (event, text) => {
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
})

listen("save", async (event) => {
  const configDir = getConfigDir()
  createDir(configDir)
  const defaultFile = getDefaultFile()
  // @ts-ignore
  writeTextFile(defaultFile, window.getSchema())
})

listen("saveas", async (event, filename) => {
  // @ts-ignore
  writeTextFile(filename, window.getSchema())
})
