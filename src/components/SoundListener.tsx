import { readBinaryFile } from "@tauri-apps/api/fs"
import { useNTGlobalListener } from "../hooks"
import { getConfigDir } from "../listeners"

const audio = new Audio()

const SoundListener = () => {
  useNTGlobalListener(async (key, value) => {
    if (key === "/Sand/Sound" && value) {
      if (audio.src.includes(value)) {
        return
      }

      const configDir = await getConfigDir()
      const file = await readBinaryFile(configDir + `/sounds/${value}.mp3`)
      audio.src = URL.createObjectURL(new Blob([file], { type: "audio/mp3" }))
      audio.play()
    }
  })

  return <></>
}

export default SoundListener
