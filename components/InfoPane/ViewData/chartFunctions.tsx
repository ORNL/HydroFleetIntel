import { csvRow } from '../../types'

export const chartTSData = (
  rows: csvRow[],
  column: string,
  unit: string
) => {
  return rows.map((row) => {
    const fullDateString = row['Date'] + ' ' + row['Time']
    const time = new Date(fullDateString)
    if (unit == 'plant') {
      const data = Number(row[column])
      return { x: time, y: data }
    } else {
      console.log(column + unit)
      const data = Number(row[column + unit])
      return { x: time, y: data }
    }
  })
}

export const chartGadsData = (
  rows: csvRow[],
  unit: string,
  outageType: string
) => {
  //Get GADS data for chosen unit and outage type
  const gadsOfUnit = rows.filter((row) => {
    const rowUnit = row['UNIT'].slice(-1)
    const outage = row['TYPE']
    if (rowUnit == unit && outage == outageType) {
      return row
    }
  })

  //Create the GADS datasets for plotting
  const gadsChartDatasets = []
  const yAxisLabels = []
  const toolTipData = []
  let datasetCounter = 1
  gadsOfUnit.forEach((row) => {
    const yValue = row['TYPE'] + ' Event #' + datasetCounter
    const label = 'Event ' + datasetCounter
    yAxisLabels.push(yValue)
    const dataPoints = [
      { x: row['formattedStartDate'], y: yValue },
      { x: row['formattedEndDate'], y: yValue }
    ]
    gadsChartDatasets.push({
      label: label,
      //Add two so the first variable and second variable datasets will draw before these do
      order: datasetCounter + 2,
      backgroundColor: 'red',
      borderColor: 'red',
      data: dataPoints,
      yAxisID: 'y3'
    })
    datasetCounter += 1

    toolTipData.push([
      label,
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

  return { gadsChartDatasets, yAxisLabels, toolTipData, datasetCounter }
}
