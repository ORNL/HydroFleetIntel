import { Box, Flex, Heading, Select, Text } from '@chakra-ui/react'
import { Dispatch, FC, SetStateAction, useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import { SelectionDetails } from './SelectionDetails'
import { stateType, csvTypeWithFileName, csvType } from '../types'

type propTypes = {
  state: stateType
  setState: Dispatch<SetStateAction<stateType>>
}

export const InfoPane: FC<propTypes> = (props) => {
  const { state, setState } = props
  const partName = state.selected.Part_Name
  const [result, setResult] = useState<csvTypeWithFileName>(null)
  const [filteredData, setFilteredData] = useState(null)

  const hasData = result?.data?.length > 0

  const text = result?.error
    ? `No data for ${partName}`
    : hasData
    ? partName
    : 'Loading...'


  useEffect(() => {
    async function getPartInfo() {
      const formData = new FormData()
      formData.append('part', JSON.stringify(partName))
      const response = await fetch('/api/get_part_information', {
        method: 'POST',
        mode: 'cors',
        body: formData
      })
      if (response.status === 200) {
        const res = await response.json()
        setResult({
          data: res.data,
          fileName: partName,
          error: false
        })
      } 
      else if (response.status === 404) {
        setResult({
          data: [],
          fileName: partName,
          error: true
        })
      }
    }

    getPartInfo()
  }, [partName])

  // const relatedParts = state.allParts.filter((row) => {
  //   const previousLevel = parseInt(row.Part_Level) - 1
  //   const isNextLevel = previousLevel === parseInt(state.selected.Part_Level)
  //   const isSameName = row[`Level ${previousLevel}`] === partName
  //   return isNextLevel && isSameName
  // })

  let facilityUnits = result?.data
    ?.filter((row) => {
      if (row['Facility'].toLowerCase() == state.selectedFacility) {
        return row
      }
    })
    .map((item) => item['Unit'].toString())
  facilityUnits = [...new Set(facilityUnits)]

  //Refilter the dataset if user changes the unit in the top section or the generator unit number
  useMemo(() => {
    const ds = result?.data?.filter((row) => {
      if (
        row['Facility'].toLowerCase() == state.selectedFacility &&
        row['Unit'] == state.generatorUnit
      ) {
        return row
      }
    })
    setFilteredData(ds)
  }, [state.generatorUnit, state.selectedFacility, result?.data])

  const onUnitChange = (unitSelected) => {
    setState((prevState) => ({
      ...prevState,
      generatorUnit: unitSelected
    }))
  }

  return (
    <Flex direction="column" p="1em 2em 0 2em">
      <Box textAlign={'center'}>
        <Heading mt="0.5rem" size="lg">
          {text}
        </Heading>
      </Box>
      {/* This is relevant to the actual specific component chosen in the levels */}
      {hasData && filteredData && (
        <SelectionDetails
          details={filteredData}
          onUnitChange={onUnitChange}
          facilityUnits={facilityUnits}
          {...props}
        />
      )}
    </Flex>
  )
}
