import { csvRow } from '../../types'
import { addMinutes } from 'date-fns'

const strToDate = (strDate) => {
  const dateParts = strDate.split(' ')
  //Reverse date string format from mm/dd/yyyy to yyyy/mm/dd for browser compatibility before converting to Date object
  const splitDate = dateParts[0].split('/')
  const reformatDate = [splitDate[2], splitDate[0], splitDate[1]].join('/')
  const dateObj = new Date(reformatDate + ' ' + dateParts[1])
  return dateObj
}

export const getGadsData = (
  rows: csvRow[],
  unit: string,
  outageType: string
) => {

  //Get GADS data for chosen unit and outage type
  const gadsOfUnit = rows.filter((row) => {
    const rowUnit = row['UNIT'].trimEnd().slice(-1)
    const outage = row['TYPE']
    if (rowUnit == unit && outage == outageType) {
      row['UNIT'] = rowUnit
      return row
    }
  })

  //Need deep copy of data to display a table with
  //Remove formatted date columns from tableData so it does not display when table is rendered
  let tableData: csvRow[] = gadsOfUnit.map(({formattedStartDate, formattedEndDate, ...keep}) => keep)
  
  return { gadsOfUnit, tableData }
}

export const createGadsDatasets = (
  rows: csvRow[], 
  xAxisDict: {unit: {earliestDate: string, latestDate: string}},
  unit: string
) => {
  let datasets = []
  let yAxisLabels = []
  let toolTipData = []
  let dsCounter = 1
  rows.forEach((row) => {
    const yValue = row['TYPE'] + ' Event #' + dsCounter
    const label = 'Event ' + dsCounter
    dsCounter += 1
    yAxisLabels.push(yValue)
    const dataPoints = [
      { x: row['formattedStartDate'], y: yValue },
      { x: row['formattedEndDate'], y: yValue }
    ]

    const ds = {
      label: label,
      backgroundColor: 'red',
      borderColor: 'red',
      data: dataPoints,
      yAxisID: 'y'
    }
    datasets.push(ds)

    //Create tooltip data
    toolTipData.push([
      row['EVENT TIMES START'],
      row['EVENT TIMES END'],
      row['DURATION'],
      row['CAUSE CODE'],
      row['CAUSE CODE DESCRIPTION'],
      row['EVENT DESCRIPTION'],
      row['MWHL'],
      row['MW IMPACT']
    ])
  })

  //Extrapolate the time between the earliest datetime and the latest datetime
  //in one minute increments. These times will be used for the x-axis of the chart.
  let xAxisLabels = []
  let current = strToDate(xAxisDict[unit].earliestDate)
  while (current < strToDate(xAxisDict[unit]['latestDate'])) {
    current = addMinutes(current, 1)
    xAxisLabels.push(current)
  }

  return { datasets, yAxisLabels, xAxisLabels, toolTipData }
}
