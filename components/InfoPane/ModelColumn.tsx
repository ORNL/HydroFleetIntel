import { Box, Button, Flex, Heading, IconButton } from '@chakra-ui/react'
import { Dispatch, FC, SetStateAction } from 'react'
import { dataAndModelsList } from '../constants'
import { stateType } from '../types'

type propTypes = {
  modelArray: typeof dataAndModelsList
  setState: Dispatch<SetStateAction<stateType>>
}

export const ModelColumn: FC<propTypes> = (props) => {
  const { modelArray, setState } = props
  return (
    <Flex
      direction={'column'}
      justify="flex-start"
      textAlign={'left'}
      gridGap="1em"
      flex={1}
      minW="0"
    >
      {modelArray.map((model) => (
        <Flex
          key={model.name}
          title={model.name}
          onClick={() => {
            const showReportIndex = dataAndModelsList.findIndex(
              ({ name }) => name === model.name
            )
            setState((oldState) => ({
              ...oldState,
              showReportIndex
            }))
          }}
        >
          <IconButton
            border={`3px solid ${model.color}`}
            borderRadius={'0px'}
            aria-label={model.iconAriaLabel}
            color={'black'}
            size="md"
            icon={model.icon}
            background={'unset'}
            isDisabled={model.disabled}
          />
          <Button
            h="100%"
            m="auto"
            border="1px solid black"
            flex={1}
            background={model.color}
            _hover={{ background: `${model.hoverColor}` }}
            borderRadius={'0px'}
            isDisabled={model.disabled}
          >
            <Heading
              w="100%"
              as="h6"
              size="sm"
              mb={0}
              textAlign={'left'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
              color={'white'}
              alignSelf="center"
            >
              {model.name}
            </Heading>
          </Button>
        </Flex>
      ))}
    </Flex>
  )
}
