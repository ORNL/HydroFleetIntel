import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import { Dispatch, FC, SetStateAction } from 'react'
import { csvRow, stateType } from '../types'

type propTypes = {
  partArray: csvRow[]
  setState: Dispatch<SetStateAction<stateType>>
}

export const RelatedPartBox: FC<propTypes> = (props) => {
  const { partArray, setState } = props

  return (
    <Flex
      direction={'column'}
      justify="flex-start"
      textAlign={'left'}
      gridGap="0.5em"
      flex={1}
      minW="0"
    >
      {partArray.map((part) => (
        <Button
          key={part.Part_Name}
          borderRadius={'0px'}
          p="0.5em"
          justifyContent={'flex-start'}
          textAlign={'left'}
          background="#d9d9d9"
          border="1px solid black"
          onClick={() => {
            setState((oldState) => ({ ...oldState, selected: part }))
          }}
        >
          <Heading
            as="h6"
            size="sm"
            textAlign={'left'}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
          >
            {part.Part_Name}
          </Heading>
        </Button>
      ))}
    </Flex>
  )
}
