// @ts-nocheck
 export function offset(tick, total) {
    const offset = (tick / total) * 100
    return `left:${offset}%`
  }
