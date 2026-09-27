import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import QrScanner from './QrScanner.jsx'

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const LUNCH_BREAK_MINUTES = 30

// Hours between two clock times, minus an automatic 30-minute lunch break
// (never below 0).
const hoursBetween = (start, end) => {
  if (!TIME_RE.test(start) || !TIME_RE.test(end)) return ''
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let minutes = eh * 60 + em - (sh * 60 + sm)
  if (minutes < 0) minutes += 24 * 60
  minutes = Math.max(minutes - LUNCH_BREAK_MINUTES, 0)
  return String(Math.round((minutes / 60) * 100) / 100)
}

const DEFAULT_HOURS = '11.5'
const emptyEntry = () => ({
  name: '',
  startTime: '',
  endTime: '',
  hours: DEFAULT_HOURS,
  rate: '',
  note: '',
})

// Accepts "11.5" or "11,5" (comma is the decimal separator in uk/pl/ru/cs locales).
const toNum = (value) => Number(String(value).trim().replace(',', '.'))
const onlyDecimalChars = (value) => value.replace(/[^0-9.,]/g, '')

const inputClass =
  'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white'

const toEntryRows = (record, crews) => {
  if (record.entries?.length) {
    return record.entries.map((e) => ({
      name: e.name,
      startTime: e.startTime || '',
      endTime: e.endTime || '',
      hours: String(e.hours),
      rate: e.rate ?? '',
      note: e.note || '',
    }))
  }
  // Legacy record: every crew member was credited with the record's hours.
  const crew = crews.find((c) => c.id === record.crewId)
  if (!crew) return []
  return crew.members.map((name) => ({
    ...emptyEntry(),
    name,
    hours: String(record.hoursWorked),
    rate: crew.member_rates?.[name] ?? '',
  }))
}

export default function RecordForm({
  record,
  sites,
  crews,
  workerDirectory = [],
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}) {
  const { t } = useTranslation()
  const [siteId, setSiteId] = useState(record ? String(record.siteId) : '')
  const [crewId, setCrewId] = useState(record?.crewId ? String(record.crewId) : '')
  const [dateStr, setDateStr] = useState(
    (record ? new Date(record.date) : new Date()).toISOString().slice(0, 10)
  )
  const [siteNote, setSiteNote] = useState(record?.tasksCompleted.join('\n') || '')
  const [crewNote, setCrewNote] = useState(record?.crewNote || '')
  const [entries, setEntries] = useState(() => (record ? toEntryRows(record, crews) : []))
  const [materials, setMaterials] = useState(record?.materialsUsed || [])
  const [materialName, setMaterialName] = useState('')
  const [materialQty, setMaterialQty] = useState('')
  const [materialUnit, setMaterialUnit] = useState('')
  const [bulkStart, setBulkStart] = useState('')
  const [bulkEnd, setBulkEnd] = useState('')
  // Hidden by default: hours are entered per worker directly, this is only
  // a shortcut for when everyone worked the same shift.
  const [showBulkTime, setShowBulkTime] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedCrew = crews.find((c) => String(c.id) === crewId)
  const allNames = [
    ...new Set([...crews.flatMap((c) => c.members), ...workerDirectory.map((w) => w.name)]),
  ]

  const rateFor = (name) => {
    const crew =
      (selectedCrew?.members.includes(name) && selectedCrew) ||
      crews.find((c) => c.members.includes(name))
    if (crew?.member_rates?.[name] != null) return crew.member_rates[name]
    const remembered = workerDirectory.find((w) => w.name === name)
    return remembered?.rate ?? ''
  }

  const memberRow = (crew, name) => ({
    ...emptyEntry(),
    name,
    rate: crew.member_rates?.[name] ?? '',
    fromCrew: true,
  })

  const handleCrewChange = (value) => {
    setCrewId(value)
    const crew = crews.find((c) => String(c.id) === value)
    if (!crew) return
    setEntries((current) => {
      // Drop the previous crew's roster (fromCrew rows), keep manually added workers.
      const kept = current.filter((e) => !e.fromCrew)
      const present = new Set(kept.map((e) => e.name))
      const added = crew.members.filter((name) => !present.has(name)).map((name) => memberRow(crew, name))
      return [...kept, ...added]
    })
  }

  const handleQrScan = (data) => {
    setScanning(false)
    const match = /^sanjo-crew:(\d+)$/.exec(data || '')
    const id = match?.[1]
    if (id && crews.some((c) => String(c.id) === id)) {
      handleCrewChange(id)
      setError('')
    } else {
      setError(t('dashboard.invalidQr'))
    }
  }

  const updateEntry = (index, patch) =>
    setEntries((current) =>
      current.map((entry, i) => {
        if (i !== index) return entry
        const next = { ...entry, ...patch }
        if ('startTime' in patch || 'endTime' in patch) {
          const computed = hoursBetween(next.startTime, next.endTime)
          if (computed) next.hours = computed
        }
        if ('name' in patch && next.rate === '') next.rate = rateFor(next.name)
        return next
      })
    )

  const removeEntry = (index) => setEntries((current) => current.filter((_, i) => i !== index))

  // Filling in only Start or only End (not both) is fine: that one field
  // gets applied to every worker, hours stay as they were.
  const applyTimeToAll = () => {
    if (!bulkStart && !bulkEnd) return
    setEntries((current) =>
      current.map((e) => {
        const next = { ...e }
        if (bulkStart) next.startTime = bulkStart
        if (bulkEnd) next.endTime = bulkEnd
        const computed = hoursBetween(next.startTime, next.endTime)
        if (computed) next.hours = computed
        return next
      })
    )
  }

  const addMaterial = () => {
    if (!materialName) return
    setMaterials([
      ...materials,
      { name: materialName, quantity: toNum(materialQty), unit: materialUnit },
    ])
    setMaterialName('')
    setMaterialQty('')
    setMaterialUnit('')
  }

  // Hours default to DEFAULT_HOURS on every new row, so it no longer signals
  // that the row was touched — only a name means the worker is meant to be included.
  const filled = entries.filter((e) => e.name.trim())
  const totalHours = filled.reduce((sum, e) => sum + (toNum(e.hours) || 0), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!siteId) return setError(t('dashboard.siteRequired'))
    if (
      filled.some(
        (entry) =>
          !entry.name.trim() ||
          entry.hours === '' ||
          !Number.isFinite(toNum(entry.hours)) ||
          toNum(entry.hours) < 0 ||
          toNum(entry.hours) > 24
      )
    ) {
      return setError(t('dashboard.entryInvalid'))
    }
    // Editing an old record that has no per-person lines: keep its totals.
    const legacy = record && !record.entries?.length && filled.length === 0
    if (filled.length === 0 && !legacy) return setError(t('dashboard.noWorkers'))

    const payload = {
      siteId: Number(siteId),
      crewId: crewId ? Number(crewId) : undefined,
      date: new Date(dateStr).toISOString(),
      tasksCompleted: siteNote.split('\n').map((line) => line.trim()).filter(Boolean),
      crewNote: crewId ? crewNote.trim() : '',
      materialsUsed: materials,
      entries: filled.map((entry) => ({
        name: entry.name.trim(),
        startTime: entry.startTime || undefined,
        endTime: entry.endTime || undefined,
        hours: toNum(entry.hours),
        rate: entry.rate === '' ? undefined : toNum(entry.rate),
        note: entry.note.trim(),
      })),
    }
    if (legacy) {
      payload.workersPresent = record.workersPresent
      payload.hoursWorked = record.hoursWorked
    }

    setSubmitting(true)
    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <select
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          className={`${inputClass} flex-1 min-w-[150px]`}
        >
          <option value="">{t('dashboard.selectSite')}</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className={inputClass}
        />
      </div>

      <textarea
        value={siteNote}
        onChange={(e) => setSiteNote(e.target.value)}
        rows={2}
        placeholder={t('dashboard.siteNote')}
        className={inputClass}
      />

      <div className="flex gap-2">
        <select
          value={crewId}
          onChange={(e) => handleCrewChange(e.target.value)}
          className={`${inputClass} flex-1 min-w-0`}
        >
          <option value="">{t('dashboard.selectCrew')}</option>
          {crews.map((crew) => (
            <option key={crew.id} value={crew.id}>
              {crew.name} ({crew.members.length})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setScanning(true)}
          className="shrink-0 bg-gray-700 text-white px-3 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
        >
          {t('dashboard.scanQr')}
        </button>
      </div>

      {crewId && (
        <textarea
          value={crewNote}
          onChange={(e) => setCrewNote(e.target.value)}
          rows={2}
          placeholder={t('dashboard.crewNote')}
          className={inputClass}
        />
      )}

      <div className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50">
        <p className="text-sm font-semibold text-gray-600 mb-1">{t('dashboard.workers')}</p>
        <p className="text-xs text-gray-400 mb-3">{t('dashboard.lunchBreakHint')}</p>

        {entries.length > 1 && (
          <div className="mb-3 pb-3 border-b border-gray-200">
            {showBulkTime ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">{t('dashboard.applyToAll')}</span>
                <input
                  type="time"
                  value={bulkStart}
                  onChange={(e) => setBulkStart(e.target.value)}
                  className={inputClass}
                  aria-label={t('dashboard.startTime')}
                />
                <span className="text-gray-400">–</span>
                <input
                  type="time"
                  value={bulkEnd}
                  onChange={(e) => setBulkEnd(e.target.value)}
                  className={inputClass}
                  aria-label={t('dashboard.endTime')}
                />
                <button
                  type="button"
                  onClick={applyTimeToAll}
                  disabled={!bulkStart && !bulkEnd}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-semibold disabled:opacity-40"
                >
                  {t('dashboard.apply')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkTime(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
                >
                  {t('common.cancel')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowBulkTime(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                {t('dashboard.setSameTime')}
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {entries.map((entry, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  list="worker-names"
                  value={entry.name}
                  onChange={(e) => updateEntry(i, { name: e.target.value })}
                  placeholder={t('dashboard.workerName')}
                  className={`${inputClass} flex-1 min-w-0`}
                />
                <button
                  type="button"
                  onClick={() => removeEntry(i)}
                  aria-label={t('dashboard.removeWorker', { name: entry.name })}
                  className="text-gray-400 hover:text-red-500 px-2"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="flex flex-col text-[11px] text-gray-400 gap-0.5">
                  {t('dashboard.startTime')}
                  <input
                    type="time"
                    value={entry.startTime}
                    onChange={(e) => updateEntry(i, { startTime: e.target.value })}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col text-[11px] text-gray-400 gap-0.5">
                  {t('dashboard.endTime')}
                  <input
                    type="time"
                    value={entry.endTime}
                    onChange={(e) => updateEntry(i, { endTime: e.target.value })}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col text-[11px] text-gray-400 gap-0.5">
                  {t('dashboard.hoursShort')}
                  <input
                    type="text"
                    inputMode="decimal"
                    value={entry.hours}
                    onChange={(e) => updateEntry(i, { hours: onlyDecimalChars(e.target.value) })}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col text-[11px] text-gray-400 gap-0.5">
                  {t('dashboard.rate')}
                  <input
                    type="text"
                    inputMode="decimal"
                    value={entry.rate}
                    onChange={(e) => updateEntry(i, { rate: onlyDecimalChars(e.target.value) })}
                    className={inputClass}
                  />
                </label>
              </div>
              <input
                type="text"
                value={entry.note}
                onChange={(e) => updateEntry(i, { note: e.target.value })}
                placeholder={t('dashboard.workerNote')}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        <datalist id="worker-names">
          {allNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <button
          type="button"
          onClick={() => setEntries([...entries, emptyEntry()])}
          className="mt-3 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
        >
          {t('dashboard.addWorker')}
        </button>

        {record && !record.entries?.length && filled.length === 0 && (
          <p className="text-xs text-amber-700 mt-2">
            {t('dashboard.legacyHint', {
              workers: record.workersPresent,
              hours: record.hoursWorked,
            })}
          </p>
        )}
        {filled.length > 0 && (
          <p className="text-sm text-gray-600 mt-3 font-semibold">
            {t('dashboard.totalLine', { workers: filled.length, hours: Math.round(totalHours * 100) / 100 })}
          </p>
        )}
      </div>

      <div className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50">
        <p className="text-sm font-semibold text-gray-600 mb-3">{t('dashboard.materialsUsed')}</p>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            placeholder={t('dashboard.materialName')}
            className={inputClass}
          />
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={materialQty}
              onChange={(e) => setMaterialQty(onlyDecimalChars(e.target.value))}
              placeholder={t('dashboard.quantity')}
              className={`${inputClass} w-1/2`}
            />
            <input
              type="text"
              value={materialUnit}
              onChange={(e) => setMaterialUnit(e.target.value)}
              placeholder={t('dashboard.unit')}
              className={`${inputClass} w-1/2`}
            />
          </div>
          <button
            type="button"
            onClick={addMaterial}
            className="bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
          >
            {t('dashboard.addMaterial')}
          </button>
          {materials.length > 0 && (
            <div className="mt-1 flex flex-col gap-1">
              {materials.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1"
                >
                  <span>
                    {m.name} — {m.quantity} {m.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMaterials(materials.filter((_, idx) => idx !== i))}
                    aria-label={t('dashboard.removeMaterial', { name: m.name })}
                    className="text-gray-400 hover:text-red-500 px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            {t('common.cancel')}
          </button>
        )}
      </div>

      {scanning && <QrScanner onScan={handleQrScan} onClose={() => setScanning(false)} />}
    </form>
  )
}
