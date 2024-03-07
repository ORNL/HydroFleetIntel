import { ChartOptions } from 'chart.js'
import React, { FC, useState, useRef, useEffect } from 'react'
import { NoData } from '../NoData'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { dataAndModelsList } from '../../constants'
import {
  filterCSVRows,
  getDates,
  getIds,
  getMaintenanceHistory,
  sortByDate
} from './functions'
import { Box, Flex, Button, Tooltip, Icon } from '@chakra-ui/react'
import { BsInfoCircle } from 'react-icons/bs'
import { Table } from './Table'
import { csvRow } from '../../types'

Chart.register(...registerables, zoomPlugin)

type propTypes = {facility: string}

export const BarChart: FC<propTypes> = (props) => {
  const { facility } = props
  const [graphYear, setGraphYear] = useState<string>(null)
  const [csvRows, setCSVRows] = useState<csvRow[]>(null)
  const [noData, setNoData] = useState(false)
  const chartRef = useRef(null)

  useEffect(() => {
    getMaintenanceHistory(facility).then((data) => {
      if (data != 'no data'){
        setCSVRows(data)
        setNoData(false)
      }
      else {
        setNoData(true)
      }
    })
  }, [facility])

  if (noData) {
    return <NoData dataType={'maintenace history'} fontSize = '3xl' color = 'red' paddingTop = '20px' justifyContent='center' />
  }
  //Wait for maintenance history function to return, until then, render nothing
  else if (csvRows == null) {
    return false
  }

  const rowsByDate = sortByDate(csvRows)

  const tableData = graphYear
    ? filterCSVRows(rowsByDate, graphYear)
    : rowsByDate

  const thisData = graphYear
    ? getIds(rowsByDate, graphYear)
    : getDates(rowsByDate)
  if (csvRows.length === 0) return null

  const data = {
    labels: thisData.map(({ label }) => label),
    datasets: [
      {
        label: graphYear ? 'Cost in Dollars' : `Number of Work Orders`,
        backgroundColor: dataAndModelsList[5].color,
        borderColor: 'black',
        data: thisData.map(({ value }) => value)
      }
    ]
  }

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom()
    }
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    onHover: (_event, elements, chart) => {
      console.log('hover')
    },

    onClick: (event, elements, chart) => {
      if (graphYear) {
        setGraphYear('')
        return
      }
      const index = elements[0]?.index
      if (!index) return
      const labels = chart.data.labels
      const label: any = labels[elements[0].index]
      setGraphYear(label)
    },

    scales: {
      y: {
        title: {
          display: true,
          text: graphYear ? 'Cost in Dollars' : `Number of Work Orders`,
          padding: 10,
          font: {
            size: 15,
            weight: 'bold'
          }
        }
      },
      x: {
        display: true,
        title: {
          display: true,
          text: graphYear ? 'Work Order Number' : `Year`,
          padding: {
            top: 10
          },
          font: {
            size: 15,
            weight: 'bold'
          }
        }
        // ticks: {
        //   minRotation: 90,
        //   maxRotation: 90
        // }
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          boxWidth: 0
        }
      },
      title: {
        display: true,
        text: graphYear ? 'Cost of Work Orders' : 'Work Orders per Year',
        padding: {
          bottom: 10
        },
        font: {
          size: 15,
          weight: 'bold'
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

  return (
    <Flex direction={'column'} h="100%">
      <Flex
        direction="row"
        justifyContent="flex-end"
        paddingBottom="1em"
        alignSelf={'right'}
      >
        <Button
          backgroundColor={'rgb(199, 218, 230)'}
          onClick={handleResetZoom}
        >
          Reset Zoom Level
        </Button>
        <Tooltip
          label="Hold the shift key down before clicking and dragging the chart to pan. Click and drag mouse over chart to zoom."
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
      <Box mb="0em" w="75%" alignSelf="center">
        <Bar ref={chartRef} options={options} data={data} />
      </Box>
      <Box w="75%" mt="1em" ml="1em" mb="1em" alignSelf="center">
        <Table csvRows={tableData} />
      </Box>
    </Flex>
  )
}
