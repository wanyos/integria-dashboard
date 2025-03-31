import dayjs from 'dayjs'

export default class DateRangeCalculator {
  static optionsMap = {
    Yesterday: 'yesterday',
    'This Week': 'thisWeek',
    'Last Week': 'lastWeek',
    'Last 30 Days': 'last30Days',
    'Last Month': 'lastMonth',
    'This Month': 'thisMonth',
    'Last 7 Months': 'last6Months',
    'Last 4 Months': 'last3Months',
    'This Year': 'thisYear',
    'Last Year': 'lastyear',
  }

  static getDateRange(selection, currentYear) {
    const currentDate = dayjs()
    const key = this.optionsMap[selection]
    let startDate, endDate

    switch (key) {
      case 'yesterday':
        startDate = currentDate.subtract(1, 'day').startOf('day')
        endDate = currentDate.subtract(1, 'day').endOf('day')
        break
      case 'thisWeek':
        startDate =
          currentDate.day() === 0
            ? currentDate.subtract(6, 'day')
            : currentDate.startOf('week').add(1, 'day')
        endDate = startDate.add(6, 'day')
        break
      case 'lastWeek':
        startDate =
          currentDate.day() === 0
            ? currentDate.subtract(13, 'day')
            : currentDate.startOf('week').subtract(6, 'day')
        endDate = startDate.add(6, 'day')
        break
      case 'last30Days':
        startDate = currentDate.subtract(30, 'days')
        endDate = currentDate
        break
      case 'lastMonth':
        startDate = currentDate.subtract(1, 'month').startOf('month')
        endDate = currentDate.subtract(1, 'month').endOf('month')
        break
      case 'thisMonth':
        startDate = currentDate.startOf('month')
        endDate = currentDate.endOf('month')
        break
      case 'last3Months':
        startDate = currentDate.subtract(3, 'months').startOf('month')
        endDate = currentDate.endOf('month')
        break
      case 'last6Months':
        startDate = currentDate.subtract(6, 'months').startOf('month')
        endDate = currentDate.endOf('month')
        break
      case 'thisYear':
        startDate = currentDate.startOf('year')
        // startDate = currentDate.subtract(1, 'year').startOf('year')
        endDate = currentDate.endOf('year')
        break
      case 'lastyear':
        startDate = currentDate.subtract(1, 'year').startOf('year')
        endDate = currentDate.subtract(1, 'year').endOf('year')
        break
      default:
        startDate = currentDate.startOf('day')
        endDate = currentDate.endOf('day')
    }

    return { startDate, endDate }
  }
}
