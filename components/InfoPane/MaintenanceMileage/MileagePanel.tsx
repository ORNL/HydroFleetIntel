import { Box, Flex, Heading, Spinner, Button, Text } from '@chakra-ui/react'
import React, { FC, useState, useEffect } from 'react'
import { NoData } from '../NoData'
import { MileageChart } from './MileageChart'
import { GeneratorUnitRadio } from '../ViewData/GeneratorUnitRadio'
import DatePicker from 'react-datepicker'
import formStyles from '../ViewData/parameterpanel.module.css'
import mileStyles from './mileagepanel.module.css'

type propTypes = {
  partName: string
  facility: string
  facilityUnits: string[]
  onUnitChange: Function
  selectedUnit: string
}

type userInputTypes = {
  file: File
  comDate: Date
  dStartDate: Date
  dEndDate: Date
}

export const MileagePanel: FC<propTypes> = (props) => {
  const { partName, facility, facilityUnits, onUnitChange, selectedUnit } =
    props
  const [parameters, setParameters] = useState<userInputTypes>({
    file: null,
    comDate: null,
    dStartDate: null,
    dEndDate: null
  })
  //File inputs have to be destroyed and recreated when resetting the file to null outside
  //of the input field itself
  const [resetKey, setResetKey] = useState(Math.random().toString())
  const [filename, setFilename] = useState('No file selected')
  const [chartElements, setChartElements] = useState({
    calendarhrs_mileage: null,
    adjusted_mileage: null,
    xAxisValues: null,
    yAxisMax: null
  })
  const [panelFilled, setPanelFilled] = useState(false)
  const [noData, setNoData] = useState(false)
  const [emptyResult, setEmptyResult] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const [lockout, setLockout] = useState(false)

  const today = new Date()

  const resetPanel = () => {
    setPanelFilled(false)
    setChartElements({
      calendarhrs_mileage: null,
      adjusted_mileage: null,
      xAxisValues: null,
      yAxisMax: null
    })
    setParameters((prevState) => ({
      ...prevState,
      file: null
    }))
    setNoData(false)
    setEmptyResult(false)
    setResetKey(Math.random().toString())
    setFilename('No file selected')
  }

  const handleUnitChange = (value) => {
    resetPanel()
    onUnitChange(value)
  }

  // const fileChange = (e) => {
  //   if (e.target.files[0]) {
  //     setFilename(e.target.files[0].name)
  //     setParameters((prevState) => ({
  //       ...prevState,
  //       file: e.target.files[0]
  //     }))
  //   } else {
  //     setFilename('No file selected')
  //     setParameters((prevState) => ({
  //       ...prevState,
  //       file: null
  //     }))
  //   }
  // }

  const handleDateChange = (newDate, dateType) => {
    setParameters((prevState) => ({
      ...prevState,
      [dateType]: newDate
    }))
  }

  async function calc_mileage() {
    setShowSpinner(true)
    setLockout(true)
    setPanelFilled(false)
    setNoData(false)
    setEmptyResult(false)
    const formData = new FormData()
    formData.append('asset', partName)
    formData.append('facility', facility)
    formData.append('unit', selectedUnit)
    //formData.append('file', parameters.file)
    formData.append('comDate', JSON.stringify(parameters.comDate))
    formData.append('startDate', JSON.stringify(parameters.dStartDate))
    formData.append('endDate', JSON.stringify(parameters.dEndDate))
    const response = await fetch('/api/maintenance_mileage', {
      method: 'POST',
      mode: 'cors',
      body: formData
    })
    if (response.status === 200) {
      const res = await response.json()
      //Convert xAxisValues from strings to dates so chart JS can use timeseries type of x-axis
      let xAxisDates = res.xAxisValues.map((timestamp) => new Date(timestamp))
      setChartElements((prevState) => ({
        ...prevState,
        calendarhrs_mileage: res.calendarhrs_mileage,
        adjusted_mileage: res.adj_mileage,
        xAxisValues: xAxisDates,
        yAxisMax: res.yAxisMax
      }))
      setLockout(false)
      setShowSpinner(false)
      setPanelFilled(true)
      setNoData(false)
      setEmptyResult(false)
      return 'ok'
    } 
    else if (response.status === 204) {
      setLockout(false)
      setShowSpinner(false)
      setPanelFilled(false)
      setEmptyResult(true)
    }
    else if (response.status === 404) {
      setLockout(false)
      setShowSpinner(false)
      setPanelFilled(false)
      setNoData(true)
      setEmptyResult(false)
    }
    else {
      setLockout(false)
      setShowSpinner(false)
      setPanelFilled(false)
      return 'error'
    }
  }

  useEffect(() => {
    resetPanel()
    selectedUnit === 'plant' ? setLockout(true) : setLockout(false)
  }, [selectedUnit, setLockout])

  return (
    <Flex direction="row">
      <Flex id={mileStyles.mileageForm}>
        <Box p="1em" bg="#405380">
          <Heading textAlign={'center'} color="white" fontSize={'larger'}>
            Asset Mileage
          </Heading>
        </Box>
        <Box
          className={`${formStyles.parameterHeading} ${formStyles.headingPadding}`}
        >
          Unit:
        </Box>
        <GeneratorUnitRadio
          panelType="mileagecalc"
          currentUnit={selectedUnit}
          facilityUnits={facilityUnits}
          handleUnitChange={handleUnitChange}
          lockout={lockout}
        />
        {/* <Box
          className={`${formStyles.parameterHeading} ${formStyles.headingPadding}`}
        >
          Event Data File:
        </Box>
        <Flex direction="row">
          <label htmlFor="fileUpload" id={`${mileStyles.filePicker}`}>
            Choose File
          </label>
          <input
            id="fileUpload"
            key={resetKey}
            type="file"
            onChange={fileChange}
            style={{ display: 'none' }}
            disabled={lockout}
          />
          <span id={`${mileStyles.fileName}`}>{filename}</span>
        </Flex> */}
        <Box
          className={`${formStyles.parameterHeading} ${formStyles.headingPadding}`}
        >
          Commissioning Year:
        </Box>
        <Box className={mileStyles.dateContainer}>
          <DatePicker
            wrapperClassName={mileStyles.datepickerWrapper}
            className={mileStyles.singleDateDatepicker}
            placeholderText="Click to select"
            selected={parameters.comDate}
            onChange={(date) => handleDateChange(date, 'comDate')}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            maxDate={today}
            todayButton="Today"
            dateFormat="yyyy"
            disabled={lockout}
          />
        </Box>
        <Box
          className={`${formStyles.parameterHeading} ${formStyles.headingPadding}`}
        >
          Display Data Start:
        </Box>
        <Box className={mileStyles.dateContainer}>
          <DatePicker
            wrapperClassName={mileStyles.datepickerWrapper}
            className={mileStyles.singleDateDatepicker}
            placeholderText="Click to select"
            selected={parameters.dStartDate}
            onChange={(date) => handleDateChange(date, 'dStartDate')}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            minDate={new Date(1991, 0, 2)}
            maxDate={today}
            todayButton="Today"
            disabled={lockout}
          />
        </Box>
        <Box
          className={`${formStyles.parameterHeading} ${formStyles.headingPadding}`}
        >
          Display Data End:
        </Box>
        <Box className={mileStyles.dateContainer}>
          <DatePicker
            wrapperClassName={mileStyles.datepickerWrapper}
            className={mileStyles.singleDateDatepicker}
            placeholderText="Click to select"
            selected={parameters.dEndDate}
            onChange={(date) => handleDateChange(date, 'dEndDate')}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            minDate={parameters.dStartDate}
            maxDate={today}
            todayButton="Today"
            disabled={lockout}
          />
        </Box>
        <Button
          border="1px solid black"
          background="#405480"
          color="white"
          margin="25px 15px 5px 15px"
          width="60%"
          alignSelf={'center'}
          _hover={{ background: '#2f3d5c' }}
          onClick={calc_mileage}
          isDisabled={lockout}
        >
          Calculate Mileage
        </Button>
      </Flex>
      {showSpinner && (
        <Flex
          direction="column"
          alignItems={'center'}
          justifyContent={'center'}
          margin="auto"
        >
          <p id={`${mileStyles.loadingMsg}`}>
            Analyzing data, this may take a moment...
          </p>
          <Spinner color="#405480" size="xl" />
        </Flex>
      )}
      {panelFilled && <MileageChart parameters={chartElements}></MileageChart>}
      {noData && selectedUnit != 'plant' && <NoData dataType={'event'} flexGrow={1} alignSelf={'center'} justifyContent={'center'} fontSize='lg' color='red' />}
      {emptyResult && selectedUnit != 'plant' && 
        <Text margin='auto' fontSize='large' fontWeight='bold' color='red'>
          No data found for specified date range.
        </Text>
      }
      {selectedUnit === 'plant' && (
        <Text margin="auto" fontSize="large" fontWeight="bold" color="red">
          Please select a unit in order to calculate mileage.
        </Text>
      )}
    </Flex>
  )
}
