import { stateType } from './types'
import { GrTable, GrHostMaintenance } from 'react-icons/gr'
import { ImCogs } from 'react-icons/im'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { VscGraphLine } from 'react-icons/vsc'
import { BarChart } from './InfoPane/MaintenanceHistory/BarChart'
import { ParametersPanel } from './InfoPane/ViewData/ParametersPanel'
import { EventPanel } from './InfoPane/EventHistory/EventPanel'
import { MileagePanel } from './InfoPane/MaintenanceMileage/MileagePanel'

export const colors = [
  '#dbdbdb',
  '#d0f8fa',
  '#fceadc',
  '#dbeef4',
  '#eaf1df',
  '#efdbda',
  '#fff2cc',
  '#edeaf1'
]

export const nullValue = '#N/A'

export const taxonomyPath = '/HFI_taxonomy_2.csv'


export const initial: stateType = {
  selected: undefined,
  allParts: undefined,
  error: undefined,
  allFacilities: undefined,
  selectedFacility: undefined,
  generatorUnit: '1',
  showReportIndex: -1
}

const iconSize = '30px'

export const dataAndModelsList = [
  {
    name: 'View Time Series Data',
    color: '#405380',
    hoverColor: '#334266',
    icon: <VscGraphLine size={iconSize} />,
    iconAriaLabel: 'graph icon',
    component: ParametersPanel,
    disabled: false
  },
  {
    name: 'Run Reliability Model',
    color: '#c9790f',
    hoverColor: '#a1610c',
    icon: <ImCogs size={iconSize} />,
    iconAriaLabel: 'gears icon',
    disabled: true
  },
  {
    name: 'Generate Report',
    color: '#8a2828',
    hoverColor: '#6e1f20',
    icon: <HiOutlineDocumentReport size={iconSize} />,
    iconAriaLabel: 'report icon',
    disabled: true
  },
  {
    name: 'Event History',
    color: '#405380',
    hoverColor: '#334266',
    icon: <GrTable size={iconSize} />,
    iconAriaLabel: 'spreadsheet table icon',
    component: EventPanel,
    disabled: false
  },
  {
    name: 'Run Asset Mileage',
    color: '#c9790f',
    hoverColor: '#a1610c',
    icon: <ImCogs size={iconSize} />,
    iconAriaLabel: 'gears icon',
    component: MileagePanel,
    disabled: false
  },
  {
    name: 'Maintenance History',
    color: '#8a2828',
    hoverColor: '#6e1f20',
    icon: <GrHostMaintenance size={iconSize} />,
    iconAriaLabel: 'report icon with wrench to indicate maintenance report',
    component: BarChart,
    disabled: false
  }
]
