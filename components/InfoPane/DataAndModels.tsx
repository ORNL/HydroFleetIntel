import { Flex, Box } from '@chakra-ui/react'
import { Dispatch, FC, SetStateAction} from 'react'
import { dataAndModelsList } from '../constants'
import { ModelColumn } from './ModelColumn'
import { stateType } from '../types'
import { InfoHeading } from './InfoHeading'
import { Prev } from 'react-bootstrap/esm/PageItem'

type propTypes = {
  setState: Dispatch<SetStateAction<stateType>>
}

export const DataAndModels: FC<propTypes> = (props) => {
  const { setState } = props
  const arrayLength = dataAndModelsList.length

  const col1 = dataAndModelsList.filter((row, index) => arrayLength / 2 > index)

  const col2: typeof dataAndModelsList = dataAndModelsList.filter(
    (row, index) => arrayLength / 2 <= index
  )

  return (
    <>
      <InfoHeading text={'Data & Models'} />
      <Flex padding={'0 1em 0 1em'} gridGap={'2em'}>
        <ModelColumn modelArray={col1} setState={setState} />
        <ModelColumn modelArray={col2} setState={setState} />
      </Flex>
    </>
  )
}
