import React from "react"

interface Props {
  icon: string
  text: string
}

const IconAndText: React.FC<Props> = ({ icon, text }) => {
  return (
    <>
      <i className={icon} style={{ marginRight: 10 }}></i>
      <span>{text}</span>
    </>
  )
}

export default IconAndText
