import { Box, Flex, Heading } from '@chakra-ui/react'
import { FC } from 'react'
import { colors } from '../constants'
import { levelPropTypes, csvRow } from '../types'

type propTypes = levelPropTypes & {
  row: csvRow
  displaySize?: string
}

export const DisplayCell: FC<propTypes> = (props) => {
  const { row, displaySize, state, setState } = props

  const text = row.Part_Name
  const size = displaySize ? displaySize : 'xs'
  const asLookup = { md: 'h4', sm: 'h5', xs: 'h6' }
  const background =
    text === state.selected?.Part_Name ? '#f4f5da' : colors[text[0]]

  return (
    <Box
      background={background}
      outline={'1px solid black'}
      flex="1"
      as="button"
      onClick={() =>
        setState((oldState) => {
          const newRow = oldState.allParts.find((row) => text === row.Part_Name)
          const newSelected =
            oldState.selected?.Part_Name === text ? undefined : newRow
          return { ...oldState, selected: newSelected }
        })
      }
    >
      <Flex
        h="100%"
        direction={'column'}
        justify="center"
        alignItems="center"
        w="100%"
      >
        <Heading
          mt="0.5rem"
          wordBreak="break-word"
          size={size}
          as={asLookup[size]}
        >
          {text}
        </Heading>
      </Flex>
    </Box>
  )
}
