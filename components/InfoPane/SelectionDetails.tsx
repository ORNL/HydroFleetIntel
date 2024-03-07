import { Box, Flex, Select, Text } from '@chakra-ui/react'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { GeneralInformationList } from './GeneralInformationList'
import { csvRow, stateType } from '../types'
import { DataAndModels } from './DataAndModels'
import { CharacteristicsList } from './CharacteristicsList'
import { Report } from './Report'

//Referenced in renderer InfoPane.tsx
//This component renders the two-column viewer with all of the general, nameplate, and data model
//buttons on top and the graph/table below.

type propTypes = {
  details: csvRow[]
  setState: Dispatch<SetStateAction<stateType>>
  state: stateType
  onUnitChange: Function
  facilityUnits: string[]
}

export const SelectionDetails: FC<propTypes> = (props) => {
  const { details, state, setState, onUnitChange, facilityUnits } = props

  const facilityUnitOpts = facilityUnits?.map((unit) => {
    const key = 'unit' + unit

    let displayUnit
    if (unit === 'plant') {
      displayUnit = 'Plant'
    } else {
      displayUnit = unit
    }

    return (
      <option key={key} value={unit}>
        {displayUnit}
      </option>
    )
  })

  const handleChange = (value) => {
    onUnitChange(value)
  }

  return (
    <Flex direction="column" flex={1}>
      <Flex direction="row" paddingTop="1em">
        <Box h="100%" overflow={'auto'} p="1em" w="50%">
          <Flex direction="column" gridGap="1em">
            <Box as={Flex} flexDir="row">
              <Text alignSelf="center" mb={0}>
                Unit:
              </Text>
              <Select
                name="unitNum"
                value={state.generatorUnit}
                onChange={(e) => handleChange(e.target.value)}
                size="sm"
                w="auto"
                ml="5px"
              >
                {facilityUnitOpts}
              </Select>
            </Box>
            <GeneralInformationList details={details} />
            <CharacteristicsList details={details} unit={state.generatorUnit} />
          </Flex>
        </Box>
        <Box borderLeft={'2px solid black'}></Box>
        <Box h="100%" p="1em" w="50%">
          <Flex
            direction="column"
            gridGap="2em"
            justifyContent="center"
            h="100%"
          >
            <DataAndModels setState={setState} />
          </Flex>
        </Box>
      </Flex>
      <Box borderBottom={'2px solid black'}></Box>
      <Box w="100%" p="1em">
        {state.showReportIndex !== -1 && (
          <Report {...props} onUnitChange={onUnitChange} />
        )}
      </Box>
    </Flex>
  )
}
