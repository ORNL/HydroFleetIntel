import React, { useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, ChartOptions, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { Box, Flex, Button, Tooltip, Icon } from '@chakra-ui/react'
import { BsInfoCircle } from 'react-icons/bs'
import 'chartjs-adapter-date-fns'

Chart.register(...registerables, zoomPlugin)

export const MileageChart = (props) => {
  const { calendarhrs_mileage, adjusted_mileage, xAxisValues, yAxisMax } =
    props.parameters
  const chartRef = useRef(null)

  const data = {
    labels: xAxisValues,
    datasets: [
      {
        label: 'Calendar Age',
        data: calendarhrs_mileage,
        backgroundColor: '#405380',
        borderColor: '#405380',
        pointStyle: 'rect',
        pointBorderWidth: 0,
        pointBackgroundColor: '#405380'
      },
      {
        label: 'Adjusted Age',
        data: adjusted_mileage,
        backgroundColor: '#c97910',
        borderColor: '#c97910',
        pointStyle: 'rect',
        pointBorderWidth: 0,
        pointBackgroundColor: '#c97910'
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
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
          text: 'Date',
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
            month: 'MMM yyyy',
            day: 'MMM dd yyyy',
            hour: 'MMM dd H:mm',
            minute: 'MMM dd H:mm:ss'
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Accumulated Mileage (Years)',
          padding: 10,
          font: {
            size: 15,
            weight: 'bold'
          }
        },
        position: 'left',
        max: yAxisMax
      }
    },
    plugins: {
      legend: {
        display: true,
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
        }
        // callbacks: {
        //   label: editLabel,
        //   afterBody: afterBody,
        //   footer: footer
        // }
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
        <Line ref={chartRef} options={options} data={data} />
      </Box>
    </Flex>
  )
}
