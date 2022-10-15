import { Box, Menu, Portal } from "@mantine/core"
import React from "react"
import Mode from "../models/Mode"

interface Props {
  children: React.ReactNode
  title: string
  mode: Mode
  expand?: boolean
  remove?: () => void
  setTitle?: (title: string) => void
  modify?: () => void
  highlighted?: boolean
}

const WidgetCell: React.FC<Props> = ({
  mode,
  title,
  children,
  remove,
  expand,
  setTitle,
  modify,
  highlighted,
}) => {
  return (
    <div
      style={{
        width: expand ? "calc(100% - 10px)" : 124,
        height: expand ? "calc(100% - 10px)" : 124,
        margin: expand ? 5 : 10,
        flex: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: expand ? 3 : undefined,
        position: expand ? "absolute" : undefined,
        cursor: mode === Mode.Edit ? "grab" : undefined,
        transition: "200ms ease-in-out",
        boxShadow: highlighted ? "0 0 10px" : undefined,
        borderRadius: 10,
      }}
    >
      <Box
        sx={(theme) => ({
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.cyan[9]
              : theme.colors.cyan[3],
          padding: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          flex: "none",
          userSelect: "none",
          textAlign: "center",
          height: 40,
        })}
      >
        <h5
          style={{
            outline: 0,
            width: "100%",
            cursor: mode === Mode.Edit ? "text" : "default",
            userSelect: mode === Mode.Edit ? "text" : undefined,
            WebkitUserSelect: mode === Mode.Edit ? "text" : undefined,
          }}
          contentEditable={mode === Mode.Edit}
          suppressContentEditableWarning
          onBlur={
            setTitle
              ? (event) => setTitle(event.currentTarget.textContent)
              : undefined
          }
        >
          {title}
        </h5>
        {mode === Mode.Edit && (
          <>
            <div style={{ flexGrow: 1 }} />
            <Menu>
              <Menu.Target>
                <i
                  className="fa-solid fa-bars"
                  style={{ cursor: "pointer" }}
                ></i>
              </Menu.Target>
              <Portal>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => modify()}
                    icon={<i className="fa-solid fa-pen"></i>}
                  >
                    Modify
                  </Menu.Item>
                  <Menu.Item
                    onClick={remove}
                    icon={<i className="fa-solid fa-trash"></i>}
                  >
                    Remove
                  </Menu.Item>
                </Menu.Dropdown>
              </Portal>
            </Menu>
          </>
        )}
      </Box>
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.gray[9]
              : theme.colors.gray[1],
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          width: "100%",
          height: "calc(100% - 40px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          position: "relative",
        })}
      >
        {children}
      </Box>
    </div>
  )
}

export default WidgetCell
