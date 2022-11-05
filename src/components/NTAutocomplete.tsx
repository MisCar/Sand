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
  icon?: React.ReactNode
}

const NTAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  style,
  supportedWidgetTypes,
  disabled,
  label,
  icon,
}) => {
  const [[ntKeys, ntTypes], setNtKeysAndTypes] = useState<KeysAndTypes>([
    [],
    {},
  ])
  useAllNTKeys(setNtKeysAndTypes)

  return (
    <Autocomplete
      label={label}
      icon={icon}
      data={Object.keys(ntTypes).filter(
        (key) =>
          supportedWidgetTypes === undefined ||
          supportedWidgetTypes.includes("all") ||
          (supportedWidgetTypes.includes(ntTypes[key]) && !key.includes("/."))
      )}
      style={style}
      styles={{ itemsWrapper: { maxHeight: 300 } }}
      value={value}
      disabled={disabled}
      onChange={onChange}
      limit={Number.POSITIVE_INFINITY}
    />
  )
}

export default NTAutocomplete
