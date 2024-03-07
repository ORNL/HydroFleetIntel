import React, { FC, useState } from 'react'
import { Select, Box } from '@chakra-ui/react'
import styles from './parameterpanel.module.css'

type propTypes = {
  name: string
  unit: string
  filterItem: string
  currentSelection: string
  handleParameterChange: (name, selectedObj) => void
  lockout: boolean
}

export const VariableSelectList: FC<propTypes> = (props) => {
  const { name, unit, filterItem, currentSelection, handleParameterChange, lockout } =
    props

  const plantUnitVariables = [
    { csvHeading: 'Flow', displayText: 'Flow', axisLabel: ['Flow', '(cfs)'] },
    {
      csvHeading: 'UnitHeadwater',
      displayText: 'Head Water',
      axisLabel: ['Head Water', '(ft)']
    },
    { csvHeading: 'Power', displayText: 'Power', axisLabel: ['Power', '(MW)'] },
    {
      csvHeading: 'TGBearingTemp',
      displayText: 'TG Bearing Temperature',
      axisLabel: ['TG Bearing Temp', '(Farenheit)']
    },
    {
      csvHeading: 'TGBearingVib',
      displayText: 'TG Bearing Vibration',
      axisLabel: ['TG Bearing Vibration', '(mils)']
    },
    {
      csvHeading: 'UnitTailWater',
      displayText: 'Tail Water',
      axisLabel: ['Tail Water', '(ft)']
    },
    {
      csvHeading: 'WaterTemp',
      displayText: 'Upper Reservoir Water Temperature',
      axisLabel: ['Upper Res. Water Temp', '(Celcius)']
    },
    {
      csvHeading: 'WicketGate',
      displayText: 'Wicket Gate',
      axisLabel: ['Wicket Gate Position', '(degrees)']
    }
  ]

  const plantTotalVariables = [
    {
      csvHeading: 'PlantTotalEfficiency',
      displayText: 'Efficiency (Actual)',
      axisLabel: ['Actual Efficiency', '(%)']
    },
    {
      csvHeading: 'OptPlantEfficiency',
      displayText: 'Efficiency (Optimal)',
      axisLabel: ['Optimal Efficiency', '(%)']
    },
    {
      csvHeading: 'PlantTotalFlow',
      displayText: 'Flow',
      axisLabel: ['Flow', '(cfs)']
    },
    {
      csvHeading: 'GrossHead',
      displayText: 'Gross Head',
      axisLabel: ['Gross Head', '(ft)']
    },
    {
      csvHeading: 'HeadWater',
      displayText: 'Head Water',
      axisLabel: ['Head Water', '(ft)']
    },
    {
      csvHeading: 'PlantGenCurrentDay',
      displayText: 'Power Output (Current Day)',
      axisLabel: ['Power Output (Current Day)', '(MWh)']
    },
    {
      csvHeading: 'PlantTotalPower',
      displayText: 'Power Output',
      axisLabel: ['Power Output', '(MW)']
    },
    {
      csvHeading: 'PlantTotalReactive',
      displayText: 'Reactive Power',
      axisLabel: ['Reactive Power', '(MVA)']
    },
    {
      csvHeading: 'SpillFlow',
      displayText: 'Spill Flow',
      axisLabel: ['Spill Flow', '(cfs)']
    },
    {
      csvHeading: 'TailWater',
      displayText: 'Tail Water',
      axisLabel: ['Tail Water', '(ft)']
    },
    {
      csvHeading: 'WaterTemp',
      displayText: 'Upper Reservoir Water Temperature',
      axisLabel: ['Upper Res. Water Temp', '(Celcius)']
    }
  ]

  let filteredParameterChoices
  let parameterOpts
  if (unit != 'plant') {
    filteredParameterChoices = plantUnitVariables.filter(
      ({ csvHeading }) => csvHeading !== filterItem
    )
    parameterOpts = filteredParameterChoices.map(
      ({ csvHeading, displayText }) => {
        return (
          <option key={csvHeading} value={csvHeading}>
            {displayText}
          </option>
        )
      }
    )
  } else {
    filteredParameterChoices = plantTotalVariables.filter(
      ({ csvHeading }) => csvHeading !== filterItem
    )
    parameterOpts = filteredParameterChoices.map(
      ({ csvHeading, displayText }) => {
        return (
          <option key={csvHeading} value={csvHeading}>
            {displayText}
          </option>
        )
      }
    )
  }

  const handleSelect = (e, choices) => {
    const { name, value } = e.target
    const selectedItem: {
      csvHeading: string
      displayText: string
      axisLabel: string
    } = choices.find(({ csvHeading }) => csvHeading == value)
    handleParameterChange(name, selectedItem)
  }

  return (
    <>
      <Select
        name={name}
        value={currentSelection}
        onChange={(e) => handleSelect(e, filteredParameterChoices)}
        placeholder="None"
        bg="white"
        w="90%"
        paddingLeft="1em"
        borderColor="black"
        isDisabled={lockout}
      >
        {parameterOpts}
      </Select>
    </>
  )
}
