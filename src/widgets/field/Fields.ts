import Field2018 from "./2018-field"
import Field2019 from "./2019-field"
import Field2020 from "./2020-field"
import Barrel2021 from "./2021-barrel"
import Bounce2021 from "./2021-bounce"
import Field2021 from "./2021-field"
import GalacticSearchA2021 from "./2021-galacticsearcha"
import GalacticSearchB2021 from "./2021-galacticsearchb"
import Slalom2021 from "./2021-slalom"
import Field2022 from "./2022-field"

export interface FieldInfo {
  game: string
  "field-image": string
  "field-corners": {
    "top-left": [number, number]
    "bottom-right": [number, number]
  }
  "image-size": [number, number]
  "field-size": [number, number]
}

const Fields: FieldInfo[] = [
  {
    game: "FIRST Power Up",
    "field-image": Field2018,
    "field-corners": {
      "top-left": [125, 20],
      "bottom-right": [827, 370],
    },
    "field-size": [16.4592, 8.2296],
    "image-size": [960, 393],
  },
  {
    game: "Destination: Deep Space",
    "field-image": Field2019,
    "field-corners": {
      "top-left": [217, 40],
      "bottom-right": [1372, 615],
    },
    "field-size": [16.4592, 8.2296],
    "image-size": [1592, 656],
  },
  {
    game: "Infinite Recharge",
    "field-image": Field2020,
    "field-corners": {
      "top-left": [96, 25],
      "bottom-right": [1040, 514],
    },
    "field-size": [15.98295, 8.21055],
    "image-size": [1134, 540],
  },
  {
    game: "Barrel Racing Path",
    "field-image": Barrel2021,
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400],
    },
    "field-size": [9.144, 4.572],
    "image-size": [800, 420],
  },
  {
    game: "Bounce Path",
    "field-image": Bounce2021,
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400],
    },
    "field-size": [9.144, 4.572],
    "image-size": [800, 420],
  },
  {
    game: "Galactic Search A",
    "field-image": GalacticSearchA2021,
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400],
    },
    "field-size": [9.144, 4.572],
    "image-size": [800, 420],
  },
  {
    game: "Galactic Search B",
    "field-image": GalacticSearchB2021,
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400],
    },
    "field-size": [9.144, 4.572],
    "image-size": [800, 420],
  },
  {
    game: "Infinite Recharge 2021",
    "field-image": Field2021,
    "field-corners": {
      "top-left": [127, 34],
      "bottom-right": [1323, 649],
    },
    "field-size": [15.98295, 8.21055],
    "image-size": [1456, 684],
  },
  {
    game: "Slalom Path",
    "field-image": Slalom2021,
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400],
    },
    "field-size": [9.144, 4.572],
    "image-size": [800, 420],
  },
  {
    game: "Rapid React",
    "field-image": Field2022,
    "field-corners": {
      "top-left": [74, 50],
      "bottom-right": [1774, 900],
    },
    "field-size": [16.4592, 8.2296],
    "image-size": [1859, 949],
  },
]

export default Fields
