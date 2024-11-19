import dayjs from 'dayjs';

export default class DateRangeCalculator {

  static optionsMap = {
    'Yesterday': 'yesterday',
    'This Week': 'thisWeek',
    'Last Week': 'lastWeek',
    'Last 30 Days': 'last30Days',
    'Last Month': 'lastMonth',
    'This Month': 'thisMonth',
    'Last 6 Months': 'last6Months',
    'Last 3 Months': 'last3Months',
    'This Year': 'thisYear',
  };

  static getDateRange(selection) {
    const currentDate = dayjs();

    const key = this.optionsMap[selection];
    if (!key) {
      console.error('Opción inválida:', selection);
      return { startDate: null, endDate: null };
    }

    let startDate, endDate;

    switch (key) {
      case 'yesterday':
      startDate = currentDate.subtract(1, 'day').startOf('day');
      endDate = currentDate.subtract(1, 'day').endOf('day');
      break;
      case 'thisWeek':
        startDate = currentDate.day() === 0
          ? currentDate.subtract(6, 'day')
          : currentDate.startOf('week').add(1, 'day');
        endDate = startDate.add(6, 'day');
        break;
      case 'lastWeek':
        startDate = currentDate.day() === 0
          ? currentDate.subtract(13, 'day')
          : currentDate.startOf('week').subtract(6, 'day');
        endDate = startDate.add(6, 'day');
        break;
      case 'last30Days':
        startDate = currentDate.subtract(30, 'days');
        endDate = currentDate;
        break;
      case 'lastMonth':
        startDate = currentDate.subtract(1, 'month').startOf('month');
        endDate = currentDate.subtract(1, 'month').endOf('month');
        break;
      case 'thisMonth':
        startDate = currentDate.startOf('month');
        endDate = currentDate.endOf('month');
        break;
      case 'last3Months':
        startDate = currentDate.subtract(3, 'months').startOf('month');
        endDate = currentDate.endOf('month');
        break;
      case 'last6Months':
        startDate = currentDate.subtract(6, 'months').startOf('month');
        endDate = currentDate.endOf('month');
        break;
        case 'thisYear':
        startDate = currentDate.startOf('year');
        endDate = currentDate.endOf('year');
        break;
      default:
        startDate = null;
        endDate = null;
    }

    return { startDate, endDate };
  }
}
