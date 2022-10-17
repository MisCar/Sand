/** Code to interact with Tauri events */
import { listen } from "@tauri-apps/api/event"
import { open, save } from "@tauri-apps/api/dialog"
import { fs } from "@tauri-apps/api"
import { cacheDir, join } from "@tauri-apps/api/path"
import {
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs"

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
  teamNumber?: number
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

listen("save", async () => {
  // @ts-ignore
  localStorage.setItem("Schema", window.getSchema())

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
