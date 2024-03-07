import { Box, Flex, Heading, Text, Spinner, Icon } from '@chakra-ui/react'
import React, { FC, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import { NoData } from '../NoData'
import { EventHistoryChart } from './EventHistoryChart'
import { EventTypeSelect } from './EventTypeSelect'
import { GeneratorUnitRadio } from '../ViewData/GeneratorUnitRadio'
import { BsCheckCircleFill, BsExclamationCircleFill } from 'react-icons/bs'
import { csvRow } from '../../types'
import styles from '../ViewData/parameterpanel.module.css'

type propTypes = {
  facility: string
  facilityUnits: string[]
  onUnitChange: Function
  selectedUnit: string
}

export const EventPanel: FC<propTypes> = (props) => {
  const { facility, facilityUnits, onUnitChange, selectedUnit } = props
  const [lockout, setLockout] = useState(true)
  const [showSpinner, setShowSpinner] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [noData, setNoData] = useState(false)
  const today = new Date()
  const [maxDate, setMaxDate] = useState(today)
  const [data, setData] = useState<{gads: csvRow[], xAxisDates: {unit: {earliestDate: string, latestDate: string}}}>({
    gads: [],
    xAxisDates: null
  })
  const [parameters, setParameters] = useState({
    startDate: null,
    endDate: null,
    eventType: 'None'
  })

  const handleDateChange = (range) => {
    const [startDate, endDate] = range
    setDataLoaded(false)
    
    //Only allow up to 30 days of data to be shown at a time.
    let maxDate = new Date(startDate)
    if (startDate != null && endDate == null){
      maxDate.setDate(maxDate.getDate() + 30)
      setMaxDate(maxDate)
    }
    else {
      maxDate = new Date()
      setMaxDate(maxDate)
    }
    setParameters((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate
    }))
  }

  const handleUnitChange = (value) => {
    onUnitChange(value)
  }

  const handleEventTypeChange = (e) => {
    const { name, value } = e.target
    setParameters((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  async function getGADsData(sDate, eDate, facility) {
    setShowSpinner(true)
    //setLockout(true)
    const formData = new FormData()
    formData.append('startDate', JSON.stringify(sDate))
    formData.append('endDate', JSON.stringify(eDate))
    formData.append('facility', JSON.stringify(facility))
    const response = await fetch('/api/get_event_history', {
      method: 'POST',
      mode: 'cors',
      body: formData
    })
    if (response.status === 200) {
      const res  = await response.json()
      setData({"gads": res.gads, "xAxisDates": res.xAxisDates})
      setLockout(false)
      setShowSpinner(false)
      setDataLoaded(true)
      setNoData(false)
      return 'ok'
    } 
    else if (response.status === 404) {
      setLockout(true)
      setShowSpinner(false)
      setDataLoaded(false)
      setNoData(true)
    }
    else {
      setLockout(true)
      setShowSpinner(false)
      setDataLoaded(false)
      setNoData(false)
      return 'error'
    }
  }

  const showChart = useMemo(() => {
    if (selectedUnit !== 'plant'){
        setLockout(false)
        if (parameters.startDate != null &&
            parameters.endDate != null &&
            dataLoaded == false){
                getGADsData(parameters.startDate, parameters.endDate, facility)
                return false
        }
        else if (dataLoaded && parameters.eventType != 'None') {
            return true
        }
        else {
            return false
        }
    }
    else {
        setParameters((prevState) => ({
            ...prevState,
            eventType: 'None'
        }))
        setDataLoaded(false)
        setLockout(true)
        return false
    }
  }, [selectedUnit, parameters.startDate, parameters.endDate, parameters.eventType, facility, dataLoaded])

  return (
    <Flex direction="row">
      <Flex
        direction="column"
        backgroundColor="lightgray"
        border="2px solid black"
        borderRadius="5px"
        w="25%"
        paddingBottom="1em"
      >
        <Box p="1em" bg="#405380">
          <Heading textAlign={'center'} color="white" fontSize={'larger'}>
            Visualize Event History
          </Heading>
        </Box>
        <Flex direction="row" alignItems="center">
          <Box
            className={`${styles.parameterHeading} ${styles.headingPadding}`}
            flexShrink={0}
          >
            Date Range:
          </Box>
          <Box className={styles.dateContainer}>
            <DatePicker
              className={styles.datepicker}
              placeholderText="Click to select"
              selected={parameters.startDate}
              startDate={parameters.startDate}
              endDate={parameters.endDate}
              onChange={handleDateChange}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={new Date(2000, 0, 1)}
              maxDate={maxDate < today ? maxDate : today}
              todayButton="Today"
              selectsRange
            />
          </Box>
          { showSpinner==false && 
            dataLoaded &&
            <Icon className={`${styles.loadingIcon}`} boxSize={4} as={BsCheckCircleFill} color="green"/>
          }
          { showSpinner==false && 
            dataLoaded==false && 
            <Icon className={`${styles.loadingIcon}`} boxSize={4} as={BsExclamationCircleFill} color="red"/> 
          }
          { showSpinner && 
            dataLoaded==false && (
            <Box className={`${styles.loadingIcon}`}>
                <Spinner color="#405480" size="sm" />
            </Box>
          )}
        </Flex>
        <Box className={`${styles.parameterHeading} ${styles.headingPadding}`}>
          Unit:
        </Box>
        <GeneratorUnitRadio
          panelType="event"
          currentUnit={selectedUnit}
          facilityUnits={facilityUnits}
          handleUnitChange={handleUnitChange}
          lockout={lockout}
        />
        <Box className={`${styles.parameterHeading} ${styles.headingPadding}`}>
          Event Type:
        </Box>
        <EventTypeSelect
          handleEventTypeChange={handleEventTypeChange}
          currentEventType={parameters.eventType}
          lockoutStatus={lockout}
        />
      </Flex>
      {showChart && (
        <EventHistoryChart
          facility={facility}
          parameters={parameters}
          currentUnit={selectedUnit}
          baseData={data}
        ></EventHistoryChart>
      )}
      {noData && <NoData dataType='event' flexGrow={1} alignSelf={'center'} justifyContent={'center'} fontSize='lg' color='red' />}
      {!noData && selectedUnit === 'plant' && (
        <Text margin="auto" fontSize="large" fontWeight="bold" color="red">
          Please select a unit to view events.
        </Text>
      )}
    </Flex>
  )
}
