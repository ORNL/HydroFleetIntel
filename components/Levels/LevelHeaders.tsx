import { Box, Flex, Heading } from '@chakra-ui/react'
import { FC } from 'react'

export const LevelHeaders: FC = (props) => {
  const columnHeaders = Array.from({ length: 5 }, (_, i) => i + 1)

  return (
    <Flex borderBottom="1px solid black" mb="0.25em">
      {columnHeaders.map((number) => {
        return (
          <Flex
            key={`columnHeader_${number}`}
            justify={'center'}
            background="#f2f2f2"
            border="1px solid black"
            flex="1"
          >
            <Heading as="h5" mb={0} size="md">{`Level ${number}`}</Heading>
          </Flex>
        )
      })}
    </Flex>
  )
}
