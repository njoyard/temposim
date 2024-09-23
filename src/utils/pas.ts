import { DateTime } from 'luxon'

import { Pas } from './types'

export type parPas = {
  [key in Pas]: string
}

export const adjMasculin: parPas = {
  month: 'mensuel',
  year: 'annuel',
  tempo: 'par année Tempo',
  tarif: 'par période tarifaire'
}

export const adjFeminin: parPas = {
  month: 'mensuelle',
  year: 'annuelle',
  tempo: 'par année Tempo',
  tarif: 'par période tarifaire'
}

export function debutPas(pas: Pas, date: DateTime): DateTime {
  if (pas === 'month' || pas === 'year') {
    return date.startOf(pas)
  } else if (pas === 'tarif') {
    if (date.month >= 2 && date.month < 8) {
      return DateTime.fromISO(`${date.year}-02-01T00:00:00+01:00`)
    } else if (date.month < 2) {
      return DateTime.fromISO(`${date.year - 1}-08-01T00:00:00+02:00`)
    } else {
      return DateTime.fromISO(`${date.year}-08-01T00:00:00+02:00`)
    }
  } else {
    /* pas === 'tempo' */
    if (date.month >= 9) {
      return DateTime.fromISO(`${date.year}-09-01T00:00:00+02:00`)
    } else {
      return DateTime.fromISO(`${date.year - 1}-09-01T00:00:00+02:00`)
    }
  }
}

export function libellePas(pas: Pas, ts: number): string {
  let date = DateTime.fromMillis(ts)

  if (pas === 'month') {
    return date.setLocale('fr').toFormat('LLL yyyy')
  } else if (pas === 'year') {
    return date.setLocale('fr').toFormat('yyyy')
  } else if (pas === 'tarif') {
    if (date.month === 2) {
      return `févr. ${date.year} - juil. ${date.year}`
    } else {
      return `août ${date.year} - janv. ${date.year + 1}`
    }
  } else {
    /* pas === 'tempo' */
    return `${date.year} - ${date.year + 1}`
  }
}
