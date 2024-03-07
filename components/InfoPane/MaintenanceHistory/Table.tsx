import { ChartOptions } from 'chart.js'
import React, { FC, useEffect, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'bootstrap/dist/css/bootstrap.css'

import { csvRow } from '../../types'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'

import { Box } from '@chakra-ui/react'

Chart.register(...registerables)

type propTypes = { csvRows: csvRow[] }

export const Table: FC<propTypes> = (props) => {
  const { csvRows } = props
  const columns = Object.keys(csvRows[0]).map((dataField) => ({
    dataField,
    text: dataField
  }))

  useEffect(() => {
    const table = document.querySelectorAll('.react-bootstrap-table')
    if (!table[0]) return
    table[0].className = ''
  }, [])

  return (
    <Box h="100%" w="100%" overflow={'auto'}>
      <BootstrapTable
        keyField="Order"
        bordered={true}
        striped={true}
        data={csvRows}
        columns={columns}
        pagination={paginationFactory()}
      />
    </Box>
  )
}
