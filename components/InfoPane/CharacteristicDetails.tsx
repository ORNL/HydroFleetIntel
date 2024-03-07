import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { Dispatch, FC, SetStateAction } from 'react'
import { csvRow, stateType } from '../types'

type propTypes = {
  detailArray: csvRow[]
}

export const CharacteristicDetails: FC<propTypes> = (props) => {
  const { detailArray } = props
  return (
    <Flex
      direction={'column'}
      justify="flex-start"
      textAlign={'left'}
      flex={1}
      minW="0"
    >
      {detailArray.map((detail) => (
        <Flex justify={'space-between'} key={detail.Attribute}>
          <Heading size="xs" as="h6" mb={0}>
            {`${detail.Attribute}:`}
          </Heading>
          <Text fontSize={'0.8em'} mb={0}>
            {`${detail.Data} ${detail.Units}`}
          </Text>
        </Flex>
      ))}
    </Flex>
  )
}
