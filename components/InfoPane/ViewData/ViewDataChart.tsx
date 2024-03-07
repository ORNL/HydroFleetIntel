import React, { FC, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, ChartOptions, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-date-fns'
import {
  chartTSData,
  chartGadsData
} from '../ViewData/chartFunctions'
import { Box, Flex, Button, Tooltip, Icon } from '@chakra-ui/react'
import { format } from 'date-fns'
import { BsInfoCircle } from 'react-icons/bs'
import { csvRow } from '../../types'

Chart.register(...registerables, zoomPlugin)

type propTypes = {
  facility: string
  currentUnit: string
  parameters: {
    startDate: Date
    endDate: Date
    firstVariable: { name: string; legendLabel: string; axisLabel: string }
    secondVariable: { name: string; legendLabel: string; axisLabel: string }
    eventType: string
  }
  baseData: {timeseries: csvRow[], gads: csvRow[]}
}

export const ViewDataChart: FC<propTypes> = (props) => {
  const { facility, currentUnit, baseData } = props
  const { startDate, endDate, firstVariable, secondVariable, eventType } = props.parameters

  const chartRef = useRef(null)

  /////////////////////////////////////////////////////////
  //   Section 1: Create tooltip functions for chart     //
  /////////////////////////////////////////////////////////
  const title = (tooltipItems) => {
    if (tooltipItems[0].dataset['label'].includes('Event')) {
      return ''
    }
    else {
      return tooltipItems[0].label
    }
  }

  const editLabel = (tooltipItem) => {
    if (tooltipItem.dataset['label'].includes('Event')) {
      return tooltipItem.formattedValue
    } else {
      return tooltipItem.dataset['label'] + ': ' + tooltipItem.parsed.y
    }
  }

  const afterBody = (tooltipItems) => {
    if (tooltipItems[0].dataset['label'].includes('Event')) {
      let dataInfo
      tooltipItems.forEach(function (tooltipItem) {
        const matchLabel = tooltipItem.dataset['label']
        const idx = toolTipData.findIndex((item) => {
          return item[0] == matchLabel
        })
        dataInfo = toolTipData[idx]
      })
      return [
        `Event Start Time: ${dataInfo[1]}`,
        `Event End Time: ${dataInfo[2]}`,
        `Duration (Hours): ${dataInfo[3]}`,
        `Cause Code: ${dataInfo[4]}`,
        `Cause Code Description: ${dataInfo[5]}`,
        `Event Description: ${dataInfo[6]}`,
        `MWHL: ${dataInfo[7]}`,
        `MW Impact: ${dataInfo[8]}`
      ]
    }
  }

  const footer = (tooltipItems) => {
    if (tooltipItems[0].dataset['label'].includes('Event')) {
      return [
        '*Start and End Time point display may be altered to align with selected date range.',
        ' Please refer to listed Event Start and End Times above for actual values.'
      ]
    }
  }

  /////////////////////////////////////////////////////////
  //        Section 2: Create chart skeleton             //
  /////////////////////////////////////////////////////////

  const legendFilter = (legendItem) => {
    return !legendItem.text.includes('Event')
  }

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom()
    }
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    //aspectRatio: 2,
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        hoverRadius: 5,
        hoverBorderWidth: 2
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
          padding: {
            top: 10
          },
          font: {
            size: 15,
            weight: 'bold'
          }
        },
        type: 'timeseries',
        time: {
          displayFormats: {
            year: 'yyyy',
            month: 'MMM',
            day: 'MMM dd',
            hour: 'MMM dd H:mm',
            minute: 'MMM dd H:mm:ss'
          }
        },
        ticks: {
          source: 'data'
        }
      },
      y1: {
        title: {
          display: true,
          padding: 10,
          font: {
            size: 15,
            weight: 'bold'
          }
        },
        position: 'left',
        stack: 'leftStack',
        stackWeight: 2,
        grid: {
          borderColor: '#405380',
          borderWidth: 2
        }
      },
      y2: {
        display: false,
        title: {
          display: true,
          padding: 10,
          font: {
            size: 15,
            weight: 'bold'
          }
        },
        offset: true,
        stackWeight: 2,
        grid: {
          borderColor: '#c97910',
          borderWidth: 2
        }
      },
      y3: {
        display: false,
        type: 'category',
        title: {
          display: true,
          text: 'Events',
          padding: 10,
          font: {
            size: 15,
            weight: 'bold'
          }
        },
        ticks: {
          //autoSkip: false
        },
        stackWeight: 1,
        offset: true,
        grid: {
          borderColor: 'red',
          borderWidth: 2
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          filter: legendFilter,
          boxWidth: 20
        }
      },
      tooltip: {
        footerColor: 'orange',
        footerFont: {
          weight: 'bold'
        },
        callbacks: {
          label: editLabel
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          modifierKey: 'shift'
        },
        zoom: {
          drag: {
            enabled: true,
            backgroundColor: 'rgba(225, 225, 225, 0.3)',
            borderColor: 'rgba(255, 255, 255)',
            borderWidth: 1
          },
          mode: 'x'
        }
      }
    }
  }

  /////////////////////////////////////////////////////////
  //   Section 3: Create and add datasets dynamically    //
  /////////////////////////////////////////////////////////

  let datasets = []

  const sDateString = format(startDate, 'MM/dd/yyyy')
  const eDateString = format(endDate, 'MM/dd/yyyy')

  //Get x,y data for time series user inputs
  const y1Data = chartTSData(
    baseData.timeseries,
    firstVariable.name,
    currentUnit
  )
  datasets.push({
    label: firstVariable.legendLabel,
    order: 1,
    backgroundColor: '#405380',
    borderColor: '#405380',
    data: y1Data,
    yAxisID: 'y1'
  })
  //Add labels to y-axis of firstVariable data
  options.scales['y1'].title['text'] = firstVariable.axisLabel

  if (secondVariable.name) {
    const y2Data = chartTSData(
      baseData.timeseries,
      secondVariable.name,
      currentUnit
    )
    datasets.push({
      label: secondVariable.legendLabel,
      order: 2,
      backgroundColor: '#c97910',
      borderColor: '#c97910',
      data: y2Data,
      yAxisID: 'y2'
    })
    //Make 2nd y-axis visible and add labels
    options.scales['y2'].display = true
    options.scales['y2']['position'] = 'left'
    options.scales['y2']['stack'] = 'leftStack'
    options.scales['y2'].title['text'] = secondVariable.axisLabel
  } else {
    //Make 2nd y-axis invisible and remove position from chart
    options.scales['y2'].display = false
    delete options.scales['y2']['position']
    delete options.scales['y2']['stack']
    delete options.scales['y2'].title['text']
  }

  //Filter GADS data by user selections
  const { gadsChartDatasets, yAxisLabels, toolTipData } = chartGadsData(
    baseData.gads,
    currentUnit,
    eventType
  )

  if (
    eventType != null &&
    eventType != 'None' &&
    gadsChartDatasets.length > 0
  ) {
    gadsChartDatasets.forEach((gadsDS) => {
      datasets.push({
        label: gadsDS['label'],
        order: gadsDS['order'],
        backgroundColor: gadsDS['backgroundColor'],
        borderColor: gadsDS['borderColor'],
        data: gadsDS['data'],
        yAxisID: gadsDS['yAxisID']
      })
    })
    //Make 3rd y-axis visible and add labels
    options.scales['y3'].display = true
    options.scales['y3']['position'] = 'left'
    options.scales['y3']['stack'] = 'leftStack'
    options.scales['y3']['labels'] = yAxisLabels
    //Add more tooltip callbacks
    options.plugins['tooltip'].callbacks['title'] = title
    options.plugins['tooltip'].callbacks['afterBody'] = afterBody
    options.plugins['tooltip'].callbacks['footer'] = footer
  } else {
    //Make 3rd y-axis invisible and remove position from chart
    options.scales['y3'].display = false
    delete options.scales['y3']['position']
    delete options.scales['y3']['stack']
    delete options.scales['y3']['labels']
    delete options.plugins['tooltip'].callbacks['afterBody']
    delete options.plugins['tooltip'].callbacks['footer']
  }

  let data = { datasets: datasets }

  return (
    <Flex direction="column" h="100%" w="72%" padding={'0 1em 0 1em'}>
      <Flex direction="row" justifyContent="flex-end" paddingBottom="1em">
        <Button
          backgroundColor={'rgb(199, 218, 230)'}
          onClick={handleResetZoom}
        >
          Reset Zoom Level
        </Button>
        <Tooltip
          label="Hold the shift key and click and drag the chart to pan. Click and drag mouse over chart to zoom."
          placement="bottom-start"
        >
          <Flex
            w="40px"
            h="40px"
            backgroundColor={'rgb(199, 218, 230)'}
            borderRadius="8"
            justifyContent={'center'}
            alignItems={'center'}
            marginLeft="0.5em"
          >
            <Icon boxSize={5} as={BsInfoCircle} />
          </Flex>
        </Tooltip>
      </Flex>
      <Box width="67vw" height="85vh" mb="0em">
        <Line ref={chartRef} options={options} data={data} />
      </Box>
    </Flex>
  )
}
