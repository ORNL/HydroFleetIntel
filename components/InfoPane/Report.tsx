import { FC, useEffect } from 'react'
import { dataAndModelsList } from '../constants'
import { stateType } from '../types'
import { NoData } from './NoData'

type propTypes = {
  state: stateType
  facilityUnits: string[]
  onUnitChange: Function
}

export const Report: FC<propTypes> = (props) => {
  const { state, facilityUnits, onUnitChange } = props

  let Component
  let fontSize = undefined
  let color = undefined
  let paddingTop = undefined
  switch (state.showReportIndex) {
    //ViewData
    case 0:
      Component = dataAndModelsList[state.showReportIndex].component
      break
    //Reliability Model
    case 1:
      Component = NoData
      fontSize = '4xl'
      color = 'red'
      paddingTop = '20px'
      break
    //Generate Report
    case 2:
      Component = NoData
      fontSize = '4xl'
      color = 'red'
      paddingTop = '20px'
      break
    //Event History
    case 3:
      Component = dataAndModelsList[state.showReportIndex].component
      break
    //Maintenance Mileage
    case 4:
      Component = dataAndModelsList[state.showReportIndex].component
      break
    //Maintenance History
    case 5:
      Component = dataAndModelsList[state.showReportIndex].component
      break
    default:
      Component = NoData
      fontSize = '4xl'
      color = 'red'
      paddingTop = '20px'
  }

  const partName = state.selected['Part_Name'].split(' ').slice(1).join(' ')

  return (
    <Component
      partName={partName}
      facility={state.selectedFacility}
      facilityUnits={facilityUnits}
      selectedUnit={state.generatorUnit}
      onUnitChange={onUnitChange}
      fontSize={fontSize ? fontSize : 'initial'}
      color={color ? color : 'initial'}
      paddingTop={paddingTop ? paddingTop : 'initial'}
    />
  )
}
