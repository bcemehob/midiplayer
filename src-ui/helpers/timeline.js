// @ts-nocheck
function toPercent(count, total) {
  return (count / total) * 100
}

export function offset(tick, total) {
  return `left:${toPercent(tick, total)}%`
}

export function length(ticksCount, total) {
  return `width:${toPercent(ticksCount, total)}%`
}
