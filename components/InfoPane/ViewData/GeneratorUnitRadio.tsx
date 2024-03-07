import { Flex, Radio, RadioGroup } from '@chakra-ui/react'
import React, { FC } from 'react'

type propTypes = {
  panelType: string
  facilityUnits: string[]
  currentUnit?: string
  handleUnitChange: (newUnit, oldUnit?) => void
  lockout?: boolean
}

export const selectedRadioStyle = {
  '&[data-checked]': {
    background: '#405380',
    borderColor: '#405380',
    color: 'white'
  },
  '&[aria-checked=true]': {
    background: '#405380',
    borderColor: '#405380',
    color: 'white'
  },
  '&[data-checked]::before': {
    background: 'white'
  }
}

export const GeneratorUnitRadio: FC<propTypes> = (props) => {
  const { panelType, facilityUnits, currentUnit, handleUnitChange, lockout } = props

  //Exclude the "Plant" option and add it back in later if the type of panel requires it
  const onlyUnits = facilityUnits.filter((unit) => unit !== 'plant')

  const unitOpts = onlyUnits.map((unit) => {
    const key = 'unit' + unit
    return (
      <Radio
        paddingLeft="1em"
        borderColor="#405380"
        css={selectedRadioStyle}
        key={key}
        value={unit}
        isDisabled={lockout}
      >
        {'Unit ' + unit}
      </Radio>
    )
  })

  //Add back "Plant" option for certain panel types
  if (panelType == 'viewdata') {
    unitOpts.push(
      <Radio
        paddingLeft={'1em'}
        borderColor="#405380"
        css={selectedRadioStyle}
        key="plant"
        value="plant"
        isDisabled={lockout}
      >
        Plant
      </Radio>
    )
  }

  return (
    <RadioGroup
      as={Flex}
      direction="column"
      onChange={(newUnit) => handleUnitChange(newUnit, currentUnit)}
      value={currentUnit}
    >
      {unitOpts}
    </RadioGroup>
  )
}
