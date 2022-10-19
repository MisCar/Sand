import { Autocomplete } from "@mantine/core"
import { useState } from "react"
import { KeysAndTypes, useAllNTKeys } from "../hooks"

interface Props {
  value: string
  onChange: (newValue: string) => void
  supportedWidgetTypes: string[]
  disabled?: boolean
  label?: string
  style?: React.CSSProperties
}

const NTAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  style,
  supportedWidgetTypes,
  disabled,
  label,
}) => {
  const [[ntKeys, ntTypes], setNtKeysAndTypes] = useState<KeysAndTypes>([
    [],
    {},
  ])
  useAllNTKeys(setNtKeysAndTypes)

  return (
    <Autocomplete
      label={label}
      data={Object.keys(ntTypes).filter(
        (key) =>
          supportedWidgetTypes === undefined ||
          supportedWidgetTypes.includes("all") ||
          (supportedWidgetTypes.includes(ntTypes[key]) && !key.includes("/."))
      )}
      style={style}
      value={value}
      disabled={disabled}
      onChange={onChange}
      limit={Number.POSITIVE_INFINITY}
    />
  )
}

export default NTAutocomplete
