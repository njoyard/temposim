import { DateTime, Duration } from 'luxon'

import { minDate } from './prix'

type ConsoEntryTemp = {
  date: DateTime
  duree?: Duration
  puissance: number
}

export type ConsoEntry = {
  date: DateTime
  duree: Duration
  puissance: number
}

export default function parseConsoCSV(csv: string): ConsoEntry[] {
  let [metaHeader, metaData, , ...data] = csv
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split(';'))

  let typeIndex = metaHeader.indexOf('Type de donnees')

  if (metaData[typeIndex] !== 'Courbe de charge') {
    throw new Error(`Type de fichier incorrect`)
  }

  let entries: ConsoEntryTemp[] = []

  for (let [horodate, valeur] of data) {
    let date = DateTime.fromISO(horodate)
    let puissance = Number(valeur)

    if (!date.isValid || isNaN(puissance)) continue

    if (entries.length) {
      let prev = entries[entries.length - 1]
      prev.duree = date.diff(prev.date)
    }

    entries.push({ date, puissance })
  }

  // Supprimer les entrées pour lesquelles on n'a pas de prix ou de durée
  entries = entries.filter((e) => e.duree && e.date >= minDate)

  if (!entries.length) {
    throw new Error('Aucune donnée utilisable dans le fichier chargé')
  }

  return entries as ConsoEntry[]
}
