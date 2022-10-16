import React from "react"
import IconAndText from "./IconAndText"

const ConnectionIndicator: React.FC<{ connected: boolean }> = ({
  connected,
}) => {
  if (connected) {
    return (
      <IconAndText icon="fa-solid fa-check" text="Connected" color="green" />
    )
  }
  return (
    <IconAndText icon="fa-solid fa-remove" text="Disconnected" color="red" />
  )
}

export default ConnectionIndicator
