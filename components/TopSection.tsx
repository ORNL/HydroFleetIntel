import { Box, Flex, Heading, Text, Select } from '@chakra-ui/react'
import { Dispatch, FC, SetStateAction } from 'react'
import { colors, nullValue } from './constants'
import { stateType } from './types'
import { LevelHeaders } from './Levels/LevelHeaders'
import { PartSelectors } from './Levels/PartSelectors'

type propTypes = {
  state: stateType
  setState: Dispatch<SetStateAction<stateType>>
}

export const TopSection: FC<propTypes> = (props) => {
  const { state, setState } = props
  const { allParts, allFacilities, selected, selectedFacility } = state

  const allData = allParts.filter((row) => row['Level 1'] !== nullValue)

  const levelOnes = allData.filter(
    (row) => row['Level 1'] != nullValue && row['Level 2'] === nullValue
  )

  const handleFacilityChange = (e) => {
    const newFacility = e.target.value
    setState((prevState) => ({
      ...prevState,
      selectedFacility: newFacility,
      generatorUnit: '1',
      showReportIndex: -1
    }))
  }

  return (
    <Box p="2em 2em 0 2em" h="20%">
      <Box background={colors[0]} h="3em" border="1px solid black">
        <Flex height="100%">
          <Text
            ml="auto"
            mr="1em"
            mb={0}
            fontWeight="bold"
            size="sm"
            alignSelf={'center'}
          >
            Owner/Management Entity
          </Text>
          <Text
            ml="auto"
            mr="1em"
            mb={0}
            fontWeight="bold"
            size="sm"
            alignSelf={'center'}
          >
            Facility:
          </Text>
          <Select
            paddingRight="0.2em"
            alignSelf={'center'}
            backgroundColor="white"
            outline="1px solid black"
            w="max-content"
            minW={'4em'}
            value={selectedFacility}
            size={'xs'}
            onChange={handleFacilityChange}
          >
            {allFacilities.map(({ key, value, displayText }) => {
              return (
                <option key={key} value={value}>
                  {displayText}
                </option>
              )
            })}
          </Select>
        </Flex>
      </Box>
      <LevelHeaders />
      <PartSelectors
        state={state}
        setState={setState}
        thisLevelData={levelOnes}
        allData={allData}
      />
    </Box>
  )
}
