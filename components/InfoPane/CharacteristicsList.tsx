import { Box, Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { csvRow, stateType } from '../types'
import { CharacteristicDetails } from './CharacteristicDetails'
import { InfoHeading } from './InfoHeading'

type propTypes = {
  details: csvRow[]
  unit: string
}

export const CharacteristicsList: FC<propTypes> = (props) => {
  const { details, unit } = props
  const characteristics = details.filter(
    (detail) =>
      detail.Heading.includes('Characteristics') && detail.Attribute != ''
  )
  const arrayLength = characteristics.length

  const col1: csvRow[] = characteristics.filter(
    (row, index) => arrayLength / 2 > index
  )

  const col2: csvRow[] = characteristics.filter(
    (row, index) => arrayLength / 2 <= index
  )

  return (
    <Box>
      <InfoHeading text={'Nameplate Characteristics'} />
      {unit === 'plant' ? (
        <Text textAlign={'center'} paddingTop="10px">
          Nameplate information is only available at the unit level.
        </Text>
      ) : (
        <Box mt="0.5em" textAlign={'left'}>
          <Flex>
            <CharacteristicDetails detailArray={col1} />
            <Box m="7px 1em" borderRight={'2px solid black'}></Box>
            <CharacteristicDetails detailArray={col2} />
          </Flex>
        </Box>
      )}
    </Box>
  )
}
