import { Flex } from '@chakra-ui/react'
import { FC } from 'react'
import { nullValue } from '../constants'
import { levelPropTypes } from '../types'
import { PartSelector } from './PartSelector'

export const PartSelectors: FC<levelPropTypes> = (props) => {
  const { thisLevelData, allData } = props

  const levelTwoData = allData.filter(
    (row) => row['Level 2'] !== nullValue && row['Level 3'] === nullValue
  )

  const levelThreeData = allData.filter(
    (row) => row['Level 3'] !== nullValue && row['Level 4'] === nullValue
  )

  const levelFourData = allData.filter(
    (row) => row['Level 4'] !== nullValue && row['Level 5'] === nullValue
  )

  const levelFiveData = allData.filter((row) => row['Level 5'] !== nullValue)

  return (
    <Flex>
      <PartSelector {...props} thisLevelData={thisLevelData} levelNumber={1} />
      <PartSelector {...props} thisLevelData={levelTwoData} levelNumber={2} />
      <PartSelector {...props} thisLevelData={levelThreeData} levelNumber={3} />
      <PartSelector {...props} thisLevelData={levelFourData} levelNumber={4} />
      <PartSelector {...props} thisLevelData={levelFiveData} levelNumber={5} />
    </Flex>
  )
}
