import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { csvRow, stateType } from '../types'
import { InfoHeading } from './InfoHeading'

type propTypes = {
  details: csvRow[]
}

export const GeneralInformationList: FC<propTypes> = (props) => {
  const { details } = props

  return (
    <Box>
      <InfoHeading text={'General Information'} />
      <Box pl="3em" m="auto" textAlign={'left'}>
        {details.map((detail) => {
          if (
            detail.Heading !== 'General Information' ||
            detail.Attribute === ''
          )
            return null
          return (
            <Flex direction={'row'} key={detail.Attribute}>
              <Text fontSize="0.9em" fontWeight={'bold'} mb={0}>
                {`${detail.Attribute}:`}
              </Text>
              <Text fontSize="0.9em" paddingLeft="5px" mb={0}>
                {`${detail.Data}`}
              </Text>
            </Flex>
          )
        })}
      </Box>
    </Box>
  )
}
