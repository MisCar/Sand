import { TextInput } from "@mantine/core"
import { useEffect, useState } from "react"
import { camelToTitle, STYLES } from "../PropEditor"

interface Props {
  ntKey: string
  currentValue: any
  setProp: (key: string, value: any) => void
}

const DoubleEditor: React.FC<Props> = ({ ntKey, currentValue, setProp }) => {
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(currentValue)
  }, [currentValue])

  return (
    <TextInput
      key={ntKey}
      type="number"
      label={camelToTitle(ntKey)}
      style={STYLES}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      onBlur={(event) =>
        setProp(
          ntKey,
          event.currentTarget.value === ""
            ? undefined
            : parseFloat(event.currentTarget.value)
        )
      }
    />
  )
}

export default DoubleEditor
