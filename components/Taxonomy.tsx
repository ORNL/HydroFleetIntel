import { Flex } from '@chakra-ui/react'
import { FC, useState, useEffect } from 'react'
import { taxonomyPath, initial, nullValue } from './constants'
import { csvType, stateType, FacilitiesList } from './types'
import Papa from 'papaparse'
import { InfoPane } from './InfoPane/InfoPane'
import { TopSection } from './TopSection'

export const Taxonomy: FC = () => {
  const [state, setState] = useState<stateType>(initial)

  async function getFacilities() : Promise<FacilitiesList> {
    const response = await fetch('/api/get_facilities')
    const res = await response.json()
    if (response.status === 200) {
      return res.facilities
    } 
  }

  useEffect(() => {
    //Set facility dropdown
    getFacilities().then((facilities) => {
      setState((prevState) => ({
        ...prevState,
        allFacilities: facilities,
        selectedFacility: facilities[0].value
      }))
    })

    //Set Taxonomy dropdowns
    Papa.parse(taxonomyPath, {
      complete: (a: csvType) =>
        setState((oldState) => {
          // Filter out blank rows
          const allParts = a.data.filter((row) => row['Row_num'] !== '')
          return { ...oldState, allParts: allParts, selected: allParts[116] }
        }),
      header: true,
      delimiter: ',',
      download: true
    })
  }, [])

  if (state.allParts === undefined || state.selectedFacility === undefined) {
    return null
  }

  return (
    <Flex direction="column" h="100%">
      <TopSection state={state} setState={setState} />
      {state.selected !== undefined && <InfoPane state={state} setState={setState} />}
    </Flex>
  )
}
