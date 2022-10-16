import React from "react"

interface Props {
  icon: string
  text: string
  color?: string
  hideText?: boolean
}

const IconAndText: React.FC<Props> = ({ icon, text, hideText, color }) => {
  return (
    <div style={{ margin: 5, color }}>
      <i className={icon}></i>
      {hideText || <span style={{ marginLeft: 10 }}>{text}</span>}
    </div>
  )
}

export default IconAndText
