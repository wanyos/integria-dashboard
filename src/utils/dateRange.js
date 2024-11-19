import dayjs from 'dayjs'

const opt = {}

export default class DateRangeCalculator {
  static getDateRange(selection) {
    const currentDate = dayjs()

    let startDate, endDate

    switch (selection) {
      case 'thisWeek':
        startDate = currentDate.startOf('week')
        endDate = currentDate.endOf('week')
        break
      case 'lastWeek':
        startDate = currentDate.subtract(1, 'week').startOf('week')
        endDate = currentDate.subtract(1, 'week').endOf('week')
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
      default:
        startDate = null
        endDate = null
    }

    return { startDate, endDate }
  }
}
