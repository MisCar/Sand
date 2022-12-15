import { useEffect, useState } from "react"
import NetworkTables from "../thirdparty/networktables"

export const useNTConnected = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    setConnected(NetworkTables.isRobotConnected())
    const dispose: () => void = NetworkTables.addRobotConnectionListener((c) =>
      setConnected(c)
    )
    return dispose
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
        (value: T, isNew: boolean) => {
          // @ts-ignore
          if (value !== undefined && value.length !== 0) {
            setValue(value)
          }
        }
      )
      const unsubscribeRobotConnection =
        NetworkTables.addRobotConnectionListener((connected: boolean) => {
          if (
            connected &&
            NetworkTables.getValue(key) === undefined &&
            value !== undefined &&
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
  callback?: (keysAndTypes: KeysAndTypes) => void
): [
  string[],
  {
    [key: string]: string
  }
] => {
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

      if (callback !== undefined) {
        callback([keys, types])
      }
    }
  }

  useEffect(() => {
    const unsubscribe: () => void = NetworkTables.addGlobalListener(keyUpdater)

    keys = Array.from(NetworkTables.getKeys())
    for (const key of keys) {
      keyUpdater(key, NetworkTables.getValue(key), true)
    }
    if (callback !== undefined) {
      callback([keys, types])
    }
    return unsubscribe
  }, [])

  return [keys, types]
}

export const useAllNTKeysState = (): [
  string[],
  {
    [key: string]: string
  }
] => {
  const [keys, setKeys] = useState<string[]>([])
  const [types, setTypes] = useState<{
    [key: string]: string
  }>({})

  useEffect(() => {
    return NetworkTables.addGlobalListener((key, value, isNew) => {
      if (isNew) {
        setKeys(NetworkTables.getKeys())
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

        if (JSON.stringify(types) != JSON.stringify(types)) {
          setTypes(types)
        }
      }
    }) as () => void
  }, [])

  return [keys, types]
}

export const useAllNTSubkeys = (prefix: string) => {
  const [keys, setKeys] = useState<string[]>([])

  useNTGlobalListener((key, _, isNew) => {
    if (isNew && key.startsWith(prefix)) {
      setKeys((keys) => [key, ...keys])
    }
  })

  return keys
}

export const useAllNTSubkeysAndValues = (prefix: string, except?: string) => {
  const [keys, setKeys] = useState<Record<string, any>[]>([])

  useNTGlobalListener((key, value, _) => {
    if (key.startsWith(prefix) && key !== prefix + "/" + except) {
      setKeys((keys) => ({ [key]: value, ...keys }))
    }
  })

  return keys
}

export const useNTGlobalListener = (
  listener: (key: string, value: any, isNew: boolean) => void
) => {
  useEffect(() => {
    const unsubscribe: () => void = NetworkTables.addGlobalListener(listener)
    return unsubscribe
  }, [])
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
