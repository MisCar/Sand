import { Accordion, Badge } from "@mantine/core"
import React, { useState } from "react"
import { useAllNTKeys } from "../hooks"
import { DEFAULTS_FOR_TYPE } from "../widgets"
import Label from "../widgets/Label"

interface NodeProps {
  tree: any
  depth: number
  prefix: string
  types: {
    [key: string]: string
  }
}

const NTNode: React.FC<NodeProps> = ({ tree, depth, prefix, types }) => {
  const [value, setValue] = useState<string[]>([])

  if (tree === undefined) {
    return <></>
  }

  return (
    <Accordion
      multiple={true}
      value={value}
      onChange={setValue}
      styles={{
        content: { padding: 0 },
        item: { backgroundColor: "inherit !important" },
        chevron: { display: "none" },
      }}
      chevron={<></>}
      variant="filled"
    >
      {Object.keys(tree)
        .sort()
        .map((entry) => {
          const leaf = Object.keys(tree[entry]).length === 0

          return (
            <Accordion.Item value={entry} key={entry}>
              <Accordion.Control
                style={{
                  paddingLeft: depth * 15 + 5,
                  paddingRight: 0,
                  transition: "transform 0.01s",
                }}
                onDragStart={(e) => {
                  const img = document.createElement("img")
                  // TODO: adjust img based on expected widget type
                  img.src =
                    "data:image/png;base64,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"
                  e.dataTransfer.setDragImage(img, 0, 0)
                  localStorage.setItem(
                    "WidgetType",
                    DEFAULTS_FOR_TYPE[types[prefix + entry]] ?? "TableView"
                  )
                  localStorage.setItem("WidgetTitle", entry)
                  localStorage.setItem("WidgetSource", prefix + entry)
                }}
                draggable
              >
                <div style={{ display: "flex" }}>
                  {leaf || (
                    <i
                      className="fa-solid fa-chevron-right"
                      style={{
                        transition: "200ms ease-in-out",
                        transform: value.includes(entry)
                          ? "rotate(90deg)"
                          : undefined,
                      }}
                    />
                  )}
                  <span
                    style={{
                      marginLeft: leaf ? 20 : 10,
                    }}
                  >
                    {entry}
                  </span>
                  <span style={{ minWidth: 100, flexGrow: 1 }} />
                  {leaf && (
                    <Label source={prefix + entry} props={{ maxWidth: 300 }} />
                  )}
                  {!leaf && types[prefix + entry] !== undefined && (
                    <Badge>{types[prefix + entry]}</Badge>
                  )}
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <NTNode
                  tree={tree[entry]}
                  types={types}
                  depth={depth + 1}
                  prefix={prefix + entry + "/"}
                />
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
    </Accordion>
  )
}

const NTTree = () => {
  const [ntKeys, ntTypes] = useAllNTKeys()

  const tree: any = {}
  for (const key of ntKeys) {
    let curr = tree
    for (const part of key.split("/").slice(1)) {
      if (part[0] === ".") {
        continue
      }
      if (curr[part] === undefined) {
        curr[part] = {}
      }
      curr = curr[part]
    }
  }

  return (
    <div style={{ width: 560 }}>
      <NTNode tree={tree} types={ntTypes} depth={0} prefix="/" />
    </div>
  )
}

export default NTTree
