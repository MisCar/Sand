import { Accordion } from "@mantine/core"
import React from "react"

interface Props extends React.PropsWithChildren {
  accordionState: string
  tab: string
}

const LazyAccordionPanel: React.FC<Props> = ({
  accordionState,
  tab,
  children,
}) => {
  return <Accordion.Panel>{accordionState == tab && children}</Accordion.Panel>
}

export default LazyAccordionPanel
