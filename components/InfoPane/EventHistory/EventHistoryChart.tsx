import React, { FC, useState, useRef, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, ChartOptions, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-date-fns'
import { getGadsData, createGadsDatasets } from './chartFunctions'
import { Box, Flex, Button, Tooltip, Icon } from '@chakra-ui/react'
import { BsInfoCircle } from 'react-icons/bs'
import { Table } from '../MaintenanceHistory/Table'
import { csvRow } from '../../types'

Chart.register(...registerables, zoomPlugin)

type propTypes = {
  facility: string
  currentUnit: string
  parameters: {
    startDate: Date
    endDate: Date
    eventType: string
  }
  baseData: {
    gads: csvRow[],
    xAxisDates: {unit: { earliestDate: string, latestDate: string}}
  }
}

export const EventHistoryChart: FC<propTypes> = (props) => {
  const { facility, currentUnit, baseData } = props
  const { startDate, endDate, eventType } = props.parameters
  const chartRef = useRef(null)

  const { gadsOfUnit, tableData } = getGadsData(
    baseData.gads,
    currentUnit,
    eventType
  )

  if (gadsOfUnit.length > 0) {
    const { datasets, yAxisLabels, xAxisLabels, toolTipData } =
    createGadsDatasets(gadsOfUnit, baseData.xAxisDates, currentUnit)

    const data = {
      labels: xAxisLabels,
      datasets: datasets
    }

    const editLabel = (tooltipItem) => {
      const label = tooltipItem.formattedValue
      return label
    }

    const afterBody = (tooltipItems) => {
      let dataInfo
      tooltipItems.forEach(function (tooltipItem) {
        const dsIdx = tooltipItem.datasetIndex
        dataInfo = toolTipData[dsIdx]
      })
      return [
        `Event Start Time: ${dataInfo[0]}`,
        `Event End Time: ${dataInfo[1]}`,
        `Duration (Hours): ${dataInfo[2]}`,
        `Cause Code: ${dataInfo[3]}`,
        `Cause Code Description: ${dataInfo[4]}`,
        `Event Description: ${dataInfo[5]}`,
        `MWHL: ${dataInfo[6]}`,
        `MW Impact: ${dataInfo[7]}`
      ]
    }

    const footer = (tooltipItems) => {
      return [
        '*Start and End Time point display may be altered to align with selected date range.',
          ' Please refer to listed Event Start and End Times above for actual values.'
      ]
    }

    const options: ChartOptions<'line'> = {
      responsive: true,
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
          }
        },
        y: {
          type: 'category',
          labels: yAxisLabels,
          position: 'left'
        }
      },
      plugins: {
        legend: {
          display: false,
          position: 'bottom',
          align: 'start',
          labels: {
            boxWidth: 20
          }
        },
        tooltip: {
          footerColor: 'orange',
          footerFont: {
            weight: 'bold'
          },
          callbacks: {
            label: editLabel,
            afterBody: afterBody,
            footer: footer
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

    const handleResetZoom = () => {
      if (chartRef && chartRef.current) {
        chartRef.current.resetZoom()
      }
    }

    return (
      <Flex direction="column" h="100%" w="75%" padding={'0 1em 0 1em'}>
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
        <Box mb="0em">
          <Line height="70%" ref={chartRef} options={options} data={data} />
        </Box>
          <Box w="100%" flex={1} ml="1em" mb="1em">
            <Table csvRows={tableData} />
          </Box>
      </Flex>
    )
  }
  else {
    return (
      <Flex direction="column" h="100%" w="75%" padding={'0 1em 0 1em'}>
        <Box mb="0em">
          <Box
            color="red"
            fontSize="large"
            fontWeight="bold"
            paddingTop="50px"
            textAlign="center"
          >
            No outages found.
          </Box>
        </Box>
      </Flex>
    )
  }
}
