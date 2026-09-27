const pad = (n) => String(n).padStart(2, '0')
const dateStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

// [firstDay, lastDay] of the calendar month a Date falls in, as "YYYY-MM-DD".
export const monthRange = (date) => {
  const y = date.getFullYear()
  const m = date.getMonth()
  const lastDay = new Date(y, m + 1, 0).getDate()
  return { from: dateStr(y, m, 1), to: dateStr(y, m, lastDay) }
}

export const sameMonth = (date, year, month) =>
  date.getFullYear() === year && date.getMonth() === month - 1
