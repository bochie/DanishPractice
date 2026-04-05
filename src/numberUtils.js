export function numberToDanish(n) {
  if (n === 0) return 'nul'
  if (n === 1) return 'en'
  if (n === 2) return 'to'
  if (n === 3) return 'tre'
  if (n === 4) return 'fire'
  if (n === 5) return 'fem'
  if (n === 6) return 'seks'
  if (n === 7) return 'syv'
  if (n === 8) return 'otte'
  if (n === 9) return 'ni'
  if (n === 10) return 'ti'
  if (n === 11) return 'elleve'
  if (n === 12) return 'tolv'
  if (n === 13) return 'tretten'
  if (n === 14) return 'fjorten'
  if (n === 15) return 'femten'
  if (n === 16) return 'seksten'
  if (n === 17) return 'sytten'
  if (n === 18) return 'atten'
  if (n === 19) return 'nitten'
  if (n === 20) return 'tyve'
  if (n === 30) return 'tredive'
  if (n === 40) return 'fyrre'
  if (n === 50) return 'halvtreds'
  if (n === 60) return 'tres'
  if (n === 70) return 'halvfjerds'
  if (n === 80) return 'firs'
  if (n === 90) return 'halvfems'
  if (n === 100) return 'hundrede'

  if (n < 100) {
    const tens = Math.floor(n / 10) * 10
    const ones = n % 10
    return `${numberToDanish(ones)}og${numberToDanish(tens)}`
  }

  if (n < 1000) {
    const hundreds = Math.floor(n / 100)
    const rest = n % 100
    const hundredWord = hundreds === 1 ? 'hundrede' : `${numberToDanish(hundreds)}hundrede`
    return rest === 0 ? hundredWord : `${hundredWord}og${numberToDanish(rest)}`
  }

  if (n < 10000) {
    const thousands = Math.floor(n / 1000)
    const rest = n % 1000
    const thousandWord = thousands === 1 ? 'tusind' : `${numberToDanish(thousands)}tusind`
    return rest === 0 ? thousandWord : `${thousandWord}${numberToDanish(rest)}`
  }

  return String(n)
}