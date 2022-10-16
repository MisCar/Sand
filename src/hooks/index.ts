import "../thirdparty/networktables"
import { useState, useEffect } from "react"

export const useNTConnected = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    NetworkTables.addRobotConnectionListener(setConnected)
    setConnected(NetworkTables.isRobotConnected())
  }, [])

  return connected
}

export const useNTKey = <T>(
  key: string | undefined,
  defaultValue?: T
): [T, (value: T) => void, boolean] => {
  const isLegalKey =
    key !== undefined &&
    key !== "" &&
    key[0] === "/" &&
    key[key.length - 1] !== "/"

  const [value, setValue] = useState<T>(
    isLegalKey ? NetworkTables.getValue(key, defaultValue) : defaultValue
  )
  const [upToDate, setUpToDate] = useState(false)

  useEffect(() => {
    if (isLegalKey) {
      const unsubscribeValue = NetworkTables.addKeyListener(
        key,
        (key: string, value: T, isNew: boolean) => {
          // @ts-ignore
          if (value !== undefined && value.length !== 0) {
            setValue(value)
          }
        },
        true
      )
      const unsubscribeRobotConnection =
        NetworkTables.addRobotConnectionListener((connected: boolean) => {
          if (
            connected &&
            NetworkTables.getValue(key) === undefined &&
            // @ts-ignore
            value.length !== 0
          ) {
            NetworkTables.putValue(key, value)
          }
        })
      return () => {
        unsubscribeValue()
        unsubscribeRobotConnection()
      }
    }
  }, [key])

  return [
    value,
    (value: T) => {
      setValue(value)
      setUpToDate(false)
      // @ts-ignore
      if (isLegalKey && value.length !== 0) {
        NetworkTables.putValue(key, value)
      }
    },
    upToDate,
  ]
}

export type KeysAndTypes = [string[], { [key: string]: string }]

let keys: string[] = []
let types: { [key: string]: string } = {}

export const useAllNTKeys = (
  callback: (keysAndTypes: KeysAndTypes) => void
) => {
  const keyUpdater = (key: string, value: any, isNew: boolean) => {
    if (isNew && types[key] === undefined) {
      keys = Array.from(NetworkTables.getKeys())

      let type: string = typeof value
      if (type === "object") {
        type = typeof value[0] + "[]"
      }

      types[key] = type

      if (key.endsWith("/.type")) {
        const parentKey = key.substring(0, key.length - 6)
        types[parentKey] = value
      }

      if (key.startsWith("/CameraPublisher")) {
        const parentKey = key.substring(0, key.lastIndexOf("/"))
        types[parentKey] = "Camera"
      }

      callback([keys, types])
    }
  }

  const unsubscribe: () => void = NetworkTables.addGlobalListener(keyUpdater)

  useEffect(() => {
    keys = Array.from(NetworkTables.getKeys())
    for (const key of keys) {
      keyUpdater(key, NetworkTables.getValue(key), true)
    }
    callback([keys, types])
    return unsubscribe
  }, [])

  return [keys, types]
}

export const useNTGlobalListener = (
  listener: (key: string, value: any, isNew: boolean) => void
) => {
  const unsubcsribe = NetworkTables.addGlobalListener(listener)

  useEffect(() => () => {
    unsubcsribe()
  })
}

export const useLast = <T>(maxLength: number): [T[], (newValue: T) => void] => {
  const [values, setValues] = useState<T[]>(new Array(maxLength).fill(0))

  const addValue = (newValue: T) => {
    setValues((currentValues) => {
      const newValues = currentValues.slice(1)
      newValues.push(newValue)
      return newValues
    })
  }

  return [values, addValue]
}
