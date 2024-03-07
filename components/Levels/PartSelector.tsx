import { Box, Select } from '@chakra-ui/react'
import { ChangeEvent, FC } from 'react'
import { nullValue } from '../constants'
import { levelPropTypes } from '../types'

type propTypes = levelPropTypes & {
  levelNumber: number
}

export const PartSelector: FC<propTypes> = (props) => {
  const { thisLevelData, setState, levelNumber, state } = props
  const previousLevel = levelNumber - 1
  const partName = state.selected[`Level ${levelNumber}`]
  const selectedParent = state.selected[`Level ${previousLevel}`]
  const selectedChild = state.selected[`Level ${levelNumber + 1}`]
  const selected = partName !== nullValue && selectedChild === nullValue

  const options = thisLevelData.filter((row) => {
    const parentPart = row[`Level ${previousLevel}`]
    return levelNumber === 1 || parentPart === selectedParent
  })

  const onChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setState((oldState) => {
      const value = e.target.value === 'empty' ? selectedParent : e.target.value
      const newRow = oldState.allParts.find((row) => value === row.Part_Name)
      return { ...oldState, selected: newRow }
    })

  return (
    <Box textAlign={'center'} overflow="auto" h="100%" flex="1">
      {options.length !== 0 && (
        <Select
          backgroundColor={
            levelNumber === 5 || selected ? '#f4f5da' : 'initial'
          }
          value={partName}
          size={'xs'}
          onChange={onChange}
        >
          {levelNumber !== 1 && (
            <option key={`Level ${levelNumber} empty`} value={`empty`}>
              {''}
            </option>
          )}
          {options.map((currentLevelRow) => {
            const rawText = currentLevelRow[`Level ${levelNumber}`]
            const split = rawText.split(' ')
            const text = split.filter((_number, i) => i !== 0).join(' ')
            return (
              <option key={rawText} value={rawText}>
                {text}
              </option>
            )
          })}
        </Select>
      )}
    </Box>
  )
}
