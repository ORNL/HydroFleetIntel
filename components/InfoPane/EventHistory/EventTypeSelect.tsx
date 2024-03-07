import { Box, Select } from '@chakra-ui/react'
import React, { FC, useState } from 'react'

type propTypes = {
  handleEventTypeChange: (e) => void
  currentEventType: string
  lockoutStatus?: boolean
}

export const EventTypeSelect: FC<propTypes> = (props) => {
  const { handleEventTypeChange, currentEventType, lockoutStatus } = props

  const outageTypes = [
    {
      key: 'AV',
      value: 'AV',
      text: 'AV - Automatic Voltage Regulator'
    },
    {
      key: 'BG',
      value: 'BG',
      text: 'BG - Free Governor Unavailability'
    },
    {
      key: 'CO',
      value: 'CO',
      text: 'CO - Synchronous Condenser Operation'
    },
    {
      key: 'D1',
      value: 'D1',
      text: 'D1 - Unplanned (Forced) Derating - Immediate'
    },
    {
      key: 'D2',
      value: 'D2',
      text: 'D2 - Unplanned (Forced) Derating - Delayed'
    },
    {
      key: 'D3',
      value: 'D3',
      text: 'D3 - Unplanned (Forced) Derating - Postponed'
    },
    {
      key: 'D4',
      value: 'D4',
      text: 'D4 - Maintenance Derating'
    },
    {
      key: 'DM',
      value: 'DM',
      text: 'DM - Maintenance Derating Extension'
    },
    {
      key: 'DP',
      value: 'DP',
      text: 'DP - Planned Derating Extension'
    },
    {
      key: 'IR',
      value: 'IR',
      text: 'IR - Inactive Reserve'
    },
    {
      key: 'MB',
      value: 'MB',
      text: 'MB - Mothballed'
    },
    {
      key: 'ME',
      value: 'ME',
      text: 'ME - Maintenance Outage Extension'
    },
    {
      key: 'MO',
      value: 'MO',
      text: 'MO - Maintenance Outage'
    },
    {
      key: 'NC',
      value: 'NC',
      text: 'NC - Non-curtailing Event'
    },
    {
      key: 'PD',
      value: 'PD',
      text: 'PD - Planned Derating'
    },
    {
      key: 'PE',
      value: 'PE',
      text: 'PE - Planned Outage Extension'
    },
    {
      key: 'PO',
      value: 'PO',
      text: 'PO - Planned Outage'
    },
    {
      key: 'PP',
      value: 'PP',
      text: 'PP - Pumping Mode Operation'
    },
    {
      key: 'PS',
      value: 'PS',
      text: 'PS - Power System Stabilizer'
    },
    {
      key: 'RS',
      value: 'RS',
      text: 'RS - Reserve Shutdown'
    },
    {
      key: 'RU',
      value: 'RU',
      text: 'RU - Retired Unit'
    },
    {
      key: 'SF',
      value: 'SF',
      text: 'SF - Startup Failure'
    },
    {
      key: 'U1',
      value: 'U1',
      text: 'U1 - Unplanned (Forced) Outage - Immediate'
    },
    {
      key: 'U2',
      value: 'U2',
      text: 'U2 - Unplanned (Forced) Outage - Delayed'
    },
    {
      key: 'U3',
      value: 'U3',
      text: 'U3 - Unplanned (Forced) Outage - Postponed'
    },
    {
      key: 'None',
      value: 'None',
      text: 'None'
    }
  ]

  const selectOpts = outageTypes.map(({ key, value, text }) => {
    return (
      <option key={key} value={value}>
        {text}
      </option>
    )
  })

  const onSelection = (e) => {
    handleEventTypeChange(e)
  }

  return (
    <Select
      name="eventType"
      value={currentEventType}
      onChange={onSelection}
      bg="white"
      paddingLeft="1em"
      w="90%"
      borderColor="black"
      isDisabled={lockoutStatus}
    >
      {selectOpts}
    </Select>
  )
}
