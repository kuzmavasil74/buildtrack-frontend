// Currencies the payroll can be shown in (ISO 4217); keep in sync with the backend.
export const CURRENCIES = ['UAH', 'EUR', 'PLN', 'CZK', 'USD']

// "11 500,00 ₴" / "€11,500.00" ... according to the UI language.
export const formatMoney = (amount, currency, locale) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
