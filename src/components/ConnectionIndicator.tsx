import React from "react"

const ConnectionIndicator: React.FC<{ connected: boolean }> = ({
  connected,
}) => {
  if (connected) {
    return <p style={{ color: "green" }}>Connected</p>
  }
  return <p style={{ color: "red" }}>Disconnected</p>
}

export default ConnectionIndicator
