import { csvRow} from '../../types'

const sortByCost = (rows: csvRow[]) => {
  rows.sort((a, b) => {
    const aCost = parseFloat(a['Estimated Costs'])
    const bCost = parseFloat(b['Estimated Costs'])

    if (aCost < bCost) return 1
    if (aCost > bCost) return -1
    return 0
  })
  return rows
}

export const getDates = (csvRows: csvRow[]) => {
  const empty: { label: string; value: number }[] = []

  const recordsPerYear = csvRows.reduce((acc, row) => {
    const date = new Date(row['Basic Start Date'].split(' ')[0])
    const yearNumber = date.getFullYear()
    if (isNaN(yearNumber)) {
      return acc
    }

    const year = yearNumber.toString()

    const target = acc.find(({ label }) => label === year)
    if (!target) {
      acc.push({ label: year, value: 1 })
      return acc
    }

    const others = acc.filter(({ label }) => label !== year)
    const newEntry = { label: year, value: target.value + 1 }

    return [...others, newEntry]
  }, empty)

  const sorted = recordsPerYear.sort((a, b) => a.label.localeCompare(b.label))
  return sorted
}

export const getIds = (csvRows: csvRow[], targetYear: string) => {
  const empty: { label: string; value: number }[] = []

  const sortedRows = sortByCost(csvRows)

  return sortedRows.reduce((acc, row) => {
    const date = new Date(row['Basic Start Date'].split(' ')[0])
    const yearNumber = date.getFullYear()
    const year = yearNumber.toString()
    if (year !== targetYear) {
      return acc
    }

    const id = row['Order']
    const cost = +row['Estimated Costs']
    acc.push({ label: id, value: cost })
    return acc
  }, empty)
}

export async function getMaintenanceHistory(facility) {
  const formData = new FormData()
  formData.append('facility', JSON.stringify(facility))
  const response = await fetch('/api/get_maintenance_hist', {
    method: 'POST',
    mode: 'cors',
    body: formData
  })
  if (response.status === 200) {
    const res  = await response.json()
    console.log(res.maintenance_history)
    return res.maintenance_history
  } 
  else if (response.status === 404) {
    return 'no data'
  }
  else {
    return 'error'
  }
}

export const filterCSVRows = (rows: csvRow[], targetYear: string) => {
  const sortedRows = sortByCost(rows)

  return sortedRows.filter((row) => {
    const date = new Date(row['Basic Start Date'].split(' ')[0])
    const yearNumber = date.getFullYear()
    const year = yearNumber.toString()
    return year === targetYear
  })
}

export const sortByDate = (rows: csvRow[]) => {
  const sorted = rows.sort((a, b) => {
    const dateA = new Date(a['Basic Start Date'].split(' ')[0])
    const dateB = new Date(b['Basic Start Date'].split(' ')[0])

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1
    return 0
  })

  return sorted
}
