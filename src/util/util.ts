export function padZero(n: number) {
  return n <= 9 ? `0${n}` : n
}

export function timeFormat (time: number) {
  if (time === 0) return '00:00'
  time = Math.ceil(time)
  const min = Math.floor(time / 60)
  const s = time - min * 60
  return `${padZero(min)}:${padZero(s)}`
}
