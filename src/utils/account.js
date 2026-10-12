// Same rule as the API: the typed email must match, ignoring case and spaces.
const normalize = (email) => String(email || '').trim().toLowerCase()

export const emailMatches = (typed, email) => Boolean(normalize(typed)) && normalize(typed) === normalize(email)

// The file name from a Content-Disposition header, or the fallback.
export const fileNameFrom = (disposition, fallback) => {
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(String(disposition || ''))
  return match ? decodeURIComponent(match[1].trim()) : fallback
}
