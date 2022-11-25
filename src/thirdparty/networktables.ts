import { getSettings } from "../listeners"
import { NT4_Client } from "./networktabels4"

let values: any = {}
let connected = false
type KeyListener = (v: any, isNew: boolean) => any
let keyListeners: {
  [key: string]: Set<KeyListener>
} = {}
type RobotConnectionListener = (v: boolean) => any
let robotConnectionListeners = new Set<RobotConnectionListener>()
type GlobalListener = (key: string, v: any, isNew: boolean) => any
let globalListeners = new Set<GlobalListener>()

let announcedKeys = new Set<string>()

const onNewTopicData = (key: string, value: any) => {
  const isNew = values[key] === undefined
  values[key] = value
  for (const listener of globalListeners) {
    listener(key, value, isNew)
  }
  if (keyListeners[key]) {
    for (const listener of keyListeners[key]) {
      listener(value, isNew)
    }
  }
}

const client = new NT4_Client(
  "Sand",
  (topic) => {},
  (topic) => delete values[topic.name],
  (topic, timestamp, value) => onNewTopicData(topic.name, value),
  () => {
    connected = true
    client.subscribe(["/"], true)
    for (const listener of robotConnectionListeners) {
      listener(true)
    }
  },
  () => {
    connected = false
    for (const listener of robotConnectionListeners) {
      listener(false)
    }
    announcedKeys.clear()
  }
)

const setValue = (key: string, value: any) => {
  if (!announcedKeys.has(key)) {
    let type: string = typeof value
    if (type === "number") {
      type = "double"
    }
    if (Array.isArray(value)) {
      type = typeof value[0] + "[]"
    }
    if (type === "number[]") {
      type = "double[]"
    }
    client.publishTopic(key, type)
    announcedKeys.add(key)
  }
  client.addSample(key, value)
  onNewTopicData(key, value)
}

export default {
  getValue: (key: string, defaultValue?: any) => values[key] ?? defaultValue,
  setValue,
  addKeyListener: (key: string, listener: KeyListener) => {
    if (keyListeners[key] === undefined) {
      keyListeners[key] = new Set()
    }
    keyListeners[key].add(listener)
    return () => keyListeners[key].delete(listener)
  },
  addRobotConnectionListener: (listener: RobotConnectionListener) => {
    robotConnectionListeners.add(listener)
    return () => robotConnectionListeners.delete(listener)
  },
  addGlobalListener: (listener: GlobalListener) => {
    globalListeners.add(listener)
    for (const k in values) {
      listener(k, values[k], true)
    }
    return () => globalListeners.delete(listener)
  },
  isRobotConnected: () => connected,
  getKeys: () => Object.keys(values),
  putValue: setValue,
}

const settings = await getSettings()
client.connect(settings?.robotAddress ?? "localhost")
