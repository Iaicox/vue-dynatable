export default function priceFilter(val, needsigns = true, decimal = 2) {
  val = +val
  if (!val)
    return '-'
  return val.toLocaleString('fr-FR', {
    minimumFractionDigits: needsigns ? decimal : 0,
    maximumFractionDigits: needsigns ? decimal : 0,
  })?.split(/\s/)?.join(' ')
}