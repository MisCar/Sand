import React from "react"

interface Props {
  icon: string
  text: string
  hideText?: boolean
}

const IconAndText: React.FC<Props> = ({ icon, text, hideText }) => {
  return (
    <>
      <i className={icon}></i>
      {hideText || <span style={{ marginLeft: 10 }}>{text}</span>}
    </>
  )
}

export default IconAndText
