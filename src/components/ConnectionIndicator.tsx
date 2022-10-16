import React from "react"
import IconAndText from "./IconAndText"

const ConnectionIndicator: React.FC<{ connected: boolean }> = ({
  connected,
}) => {
  const icon = connected ? "fa-solid fa-check" : "fa-solid fa-remove"
  const text = connected ? "Connected" : "Disconnected"
  const color = connected ? "green" : "red"

  return (
    <div style={{ marginTop: 5, marginBottom: 5 }}>
      <IconAndText icon={icon} text={text} color={color} />
    </div>
  )
}

export default ConnectionIndicator
