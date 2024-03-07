import { Box, Flex, Heading, Spinner, Icon } from '@chakra-ui/react'
import React, { FC, useEffect, useState, useRef } from 'react'
import DatePicker from 'react-datepicker'
import { NoData } from '../NoData'
import { ViewDataChart } from './ViewDataChart'
import { EventTypeSelect } from '../EventHistory/EventTypeSelect'
import { BsCheckCircleFill, BsExclamationCircleFill } from 'react-icons/bs'
import { VariableSelectList } from './VariableSelectList'
import { GeneratorUnitRadio } from './GeneratorUnitRadio'
import { csvRow } from '../../types'
import styles from './parameterpanel.module.css'

type propTypes = {
  facility: string
  facilityUnits: string[]
  onUnitChange: Function
  selectedUnit: string
}

export const ParametersPanel: FC<propTypes> = (props) => {
  const { facility, facilityUnits, onUnitChange, selectedUnit } = props
  const [showSpinner, setShowSpinner] = useState(false)
  const [lockout, setLockout] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [panelFilled, setPanelFilled] = useState(false)
  const [noData, setNoData] = useState(false)
  const today = new Date()
  const [maxDate, setMaxDate] = useState(today)
  const [data, setData] = useState<{timeseries: csvRow[], gads: csvRow[]}>({
    timeseries: [],
    gads: []
  })
  const [parameters, setParameters] = useState({
    startDate: null,
    endDate: null,
    firstVariable: {
      name: '',
      legendLabel: null,
      axisLabel: null
    },
    secondVariable: {
      name: '',
      legendLabel: null,
      axisLabel: null
    },
    eventType: 'None'
  })

  //Because the unit number can be selected in either the SelectionDetails component or this component,
  //we need to keep track of the last selected unit value for comparison purposes when
  //deciding whether to reset dropdown menus and the chart or not.
  const lastSelectedUnit = useRef(selectedUnit)

  const handleUnitChange = (newUnit, oldUnit) => {
    //If switching between units
    if (newUnit != 'plant' && oldUnit != 'plant') {
      onUnitChange(newUnit)
      lastSelectedUnit.current = newUnit
    } else {
      //If switching between a unit and the plant or vice-versa
      setPanelFilled(false)
      onUnitChange(newUnit)
      lastSelectedUnit.current = newUnit
      setParameters((prevState) => ({
        ...prevState,
        firstVariable: {
          name: '',
          legendLabel: null,
          axisLabel: null
        },
        secondVariable: {
          name: '',
          legendLabel: null,
          axisLabel: null
        },
        eventType: 'None'
      }))
    }
  }
  
  const handleDateChange = (range) => {
    const [startDate, endDate] = range
    setDataLoaded(false)
    setPanelFilled(false)
    
    //Only allow up to 30 days of data to be shown at a time.
    let maxDate = new Date(startDate)
    if (startDate != null && endDate == null){
      maxDate.setDate(maxDate.getDate() + 30)
      //maxDate.setFullYear(maxDate.getFullYear() + 1)
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

  const handleParameterChange = (name, selection) => {
    if (selection === undefined) {
      if (name == 'firstVariable') {
        setPanelFilled(false)
        setParameters((prevState) => ({
          ...prevState,
          [name]: {
            name: '',
            legendLabel: null,
            axisLabel: null
          },
          secondVariable: {
            name: '',
            legendLabel: null,
            axisLabel: null
          },
          eventType: 'None'
        }))
      } else {
        setParameters((prevState) => ({
          ...prevState,
          [name]: {
            name: '',
            legendLabel: null,
            axisLabel: null
          }
        }))
      }
    } else {
      setPanelFilled(true)
      setParameters((prevState) => ({
        ...prevState,
        [name]: {
          name: selection.csvHeading,
          legendLabel: selection.displayText,
          axisLabel: selection.axisLabel
        }
      }))
    }
  }

  const handleEventTypeChange = (e) => {
    const { name, value } = e.target
    setParameters((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  async function getVizData(sDate, eDate, facility) {
    setShowSpinner(true)
    setLockout(true)
    setPanelFilled(false)
    const formData = new FormData()
    formData.append('startDate', JSON.stringify(sDate))
    formData.append('endDate', JSON.stringify(eDate))
    formData.append('facility', JSON.stringify(facility))
    const response = await fetch('/api/get_viz_data', {
      method: 'POST',
      mode: 'cors',
      body: formData
    })
    if (response.status === 200) {
      const res  = await response.json()
      setData({"timeseries": res.timeseries, "gads": res.gads})
      setLockout(false)
      setShowSpinner(false)
      setDataLoaded(true)
      setNoData(false)
      return 'ok'
    } 
    else if (response.status === 404) {
      setLockout(true)
      setShowSpinner(false)
      setNoData(true)
      return 
    }
    else {
      setLockout(true)
      setShowSpinner(false)
      setNoData(false)
      return 'error'
    }
  }

  //If someone changes the selectedUnit in SelectionDetails instead of in this component, this
  //useEffect keeps track of the change between "unit #" and "plant" and resets the state if necessary.
  //Additionally, react-datepicker fires onChange event for each individual date (start and end).
  //It gets fired before a user has selected the whole range and given the chart is live-updating, this
  //causes an error. This effect prevents the error; when the user starts to change the date range
  //the panelFilled value gets set to false. When the user has finished selecting their date range, the
  //panelFilled value gets set to true and the chart will then re-render appropriately.
  useEffect(() => {
    if (
      (selectedUnit !== 'plant' && lastSelectedUnit.current !== 'plant') ||
      (selectedUnit === 'plant' && lastSelectedUnit.current === 'plant')
    ) {
      if (
        parameters.startDate != null &&
        parameters.endDate != null &&
        dataLoaded == false
      ) {
        getVizData(parameters.startDate, parameters.endDate, facility)
      }
      if (
        dataLoaded &&
        parameters.firstVariable.name
      ) {
        setPanelFilled(true)
      } else {
        setPanelFilled(false)
      }
    } else {
      setPanelFilled(false)
      setParameters((prevState) => ({
        ...prevState,
        firstVariable: {
          name: '',
          legendLabel: null,
          axisLabel: null
        },
        secondVariable: {
          name: '',
          legendLabel: null,
          axisLabel: null
        },
        eventType: 'None'
      }))
    }
    lastSelectedUnit.current = selectedUnit
  }, [
    parameters.startDate,
    parameters.endDate,
    parameters.firstVariable.name,
    facility,
    dataLoaded,
    selectedUnit
  ])

  return (
    <Flex direction="row">
      <Flex
        direction="column"
        backgroundColor="lightgray"
        border="2px solid black"
        borderRadius="5px"
        w="28%"
        paddingBottom="1em"
      >
        <Box p="1em" bg="#405380">
          <Heading textAlign={'center'} color="white" fontSize={'larger'}>
            Visualize Time Series Data
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
          panelType="viewdata"
          currentUnit={selectedUnit}
          facilityUnits={facilityUnits}
          handleUnitChange={handleUnitChange}
          lockout={lockout}
        />
        <Box className={`${styles.parameterHeading} ${styles.headingPadding}`}>
          First Variable:
        </Box>
        <VariableSelectList
          name="firstVariable"
          unit={selectedUnit}
          filterItem={parameters.secondVariable.name}
          currentSelection={parameters.firstVariable.name}
          handleParameterChange={handleParameterChange}
          lockout={lockout}
        />
        {parameters.firstVariable.name && (
          <Box className={`${styles.parameterHeading} ${styles.headingPadding}`}>
            Second Variable:
          </Box>
        )}
        {parameters.firstVariable.name && (
          <VariableSelectList
            name="secondVariable"
            unit={selectedUnit}
            filterItem={parameters.firstVariable.name}
            currentSelection={parameters.secondVariable.name}
            handleParameterChange={handleParameterChange}
            lockout={lockout}
          />
        )}
        {parameters.firstVariable.name && selectedUnit !== 'plant' && (
          <Box className={`${styles.parameterHeading} ${styles.headingPadding}`}>
            Event Type:
          </Box>
        )}
        {parameters.firstVariable.name && selectedUnit !== 'plant' && (
          <EventTypeSelect
            handleEventTypeChange={handleEventTypeChange}
            currentEventType={parameters.eventType}
            lockoutStatus={lockout}
          />
        )}
      </Flex>
      {panelFilled && (
        <ViewDataChart
          facility={facility}
          parameters={parameters}
          baseData={data}
          currentUnit={selectedUnit}
        ></ViewDataChart>
      )}
      {noData && <NoData dataType={'timeseries'} flexGrow={1} alignSelf={'center'} justifyContent={'center'} fontSize='lg' color='red' />}
    </Flex>
  )
}
