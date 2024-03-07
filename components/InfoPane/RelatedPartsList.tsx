import { Box, Flex, Heading } from '@chakra-ui/react'
import { Dispatch, FC, SetStateAction } from 'react'
import { RelatedPartBox } from './RelatedPartBox'
import { csvRow, stateType } from '../types'
import { InfoHeading } from './InfoHeading'

type propTypes = {
  relatedParts: csvRow[]
  setState: Dispatch<SetStateAction<stateType>>
}

export const RelatedPartsList: FC<propTypes> = (props) => {
  const { relatedParts, setState } = props
  const arrayLength = relatedParts.length
  const col1: csvRow[] = relatedParts.filter(
    (row, index) => arrayLength / 2 > index
  )

  const col2: csvRow[] = relatedParts.filter(
    (row, index) => arrayLength / 2 <= index
  )

  return (
    <>
      <InfoHeading text={'Related Parts'} />

      <Flex gridGap={'2em'}>
        <RelatedPartBox partArray={col1} setState={setState} />
        <RelatedPartBox partArray={col2} setState={setState} />
      </Flex>
    </>
  )
}
