import { Dispatch, SetStateAction } from 'react'

export type stateType = {
  selected: csvRow
  allParts: csvRow[]
  error: string
  allFacilities: FacilitiesList
  //allFacilities: string[]
  selectedFacility: string
  generatorUnit: string
  showReportIndex: number
}

export type FacilitiesList = {key: string, value: string, displayText: string}[]

export type csvRow = { [level: string]: string }

export type csvType = {
  data: csvRow[]
}

export type csvTypeWithFileName = csvType & {
  fileName: string
  error: boolean
}

export type levelPropTypes = {
  state: stateType
  setState: Dispatch<SetStateAction<stateType>>
  thisLevelData: csvRow[]
  allData: csvRow[]
}
