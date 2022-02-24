export default function dateFilter(val, format = 'date') {
  const options = {}

  if (format.includes('date')) {
    options.year = 'numeric'
    options.month = '2-digit'
    options.day = '2-digit'
  }
  if (format.includes('mnsh')) {
    options.month = 'short'
  }
  if (format.includes('time')) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }
  if (format.includes('wd')) {
    options.weekday = 'short'
  }
  if (val)
    return new Intl.DateTimeFormat('ru-RU', options).format(parseDate(val))
  else
    return '-'
}

function parseDate(str) {
  if (typeof str === 'object')
    return str

  if (typeof str === 'number')
    return new Date(str)

  const parts = String(str)?.trim()?.split(/\s/g),
        date = parts?.[0]?.split('-') ?? '',
        time = parts?.[1]?.split(':') ?? ''

  return new Date(date?.[0], date?.[1] - 1, date?.[2], time?.[0] ?? '', time?.[1] ?? '', time?.[2] ?? '')
}