const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

export const LUNCH_BREAK_MINUTES = 30
export const DEFAULT_START = '07:00'
export const DEFAULT_END = '19:00'

// Hours between two "HH:MM" clock times, minus an automatic 30-minute lunch
// break (never below 0). An end before the start means the shift crossed
// midnight. Returns '' while either time is missing or malformed. Keep in
// sync with hoursBetween() in the backend's utils/parseRecordBody.js.
export const hoursBetween = (start, end) => {
  if (!TIME_RE.test(start) || !TIME_RE.test(end)) return ''
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let minutes = eh * 60 + em - (sh * 60 + sm)
  if (minutes < 0) minutes += 24 * 60
  minutes = Math.max(minutes - LUNCH_BREAK_MINUTES, 0)
  return String(Math.round((minutes / 60) * 100) / 100)
}

// Accepts "11.5" or "11,5" (comma is the decimal separator in uk/pl/ru/cs locales).
export const toNum = (value) => Number(String(value).trim().replace(',', '.'))

// Keeps only what can be part of a decimal number while the user types.
export const onlyDecimalChars = (value) => value.replace(/[^0-9.,]/g, '')
