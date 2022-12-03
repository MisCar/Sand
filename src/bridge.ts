import { ipcRenderer } from "electron"
import { mkdirSync, readFileSync } from "fs"
import { writeFileSync } from "original-fs"
import { homedir } from "os"
import { platform } from "process"

export const cacheDir = () => {
  const home = homedir()
  return (
    home +
    (platform === "win32"
      ? home + "\\AppData\\Local"
      : platform === "darwin"
      ? "/Library/Application Support"
      : "/.cache")
  )
}

export const createDir = (directory: string) => {
  mkdirSync(directory, { recursive: true })
}

export const readTextFile = (filename: string): string => {
  return readFileSync(filename).toString()
}

export const writeTextFile = (filename: string, contents: string) => {
  writeFileSync(filename, contents)
}

export const openDialog = (): Promise<string | undefined> => {
  const result = ipcRenderer.invoke("openDialog")
  result.then(console.log)
  return result
}

export const saveDialog = (): Promise<string | undefined> => {
  return ipcRenderer.invoke("save")
}

export const windowLock = () => {
  ipcRenderer.send("windowLock")
}

export const windowUnlock = () => {
  ipcRenderer.send("windowUnlock")
}

export const listen = (
  event: string,
  listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
) => {
  ipcRenderer.on(event, listener)
}
