import { DateTime } from 'luxon'

import { minDate } from './prix'
import { MesureConsommation } from './types'

export function chargerFichier(fichier: File): Promise<string> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.addEventListener('error', () => {
      reject(new Error('Impossible de charger le fichier'))
    })

    reader.addEventListener('load', async () => {
      resolve(reader.result as string)
    })

    reader.readAsText(fichier)
  })
}

export function analyseCSV(csv: string): MesureConsommation[] {
  let [metaHeader, metaData, , ...data] = csv
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split(';'))

  let typeIndex = metaHeader.indexOf('Type de donnees')

  if (metaData[typeIndex] !== 'Courbe de charge') {
    throw new Error(`Type de fichier incorrect`)
  }

  let entries: MesureConsommation[] = []
  let prev: DateTime | null = null

  for (let [horodate, valeur] of data) {
    let date = DateTime.fromISO(horodate)
    if (!date.isValid) continue

    if (prev === null) {
      // On ne stocke pas la première mesure (durée inconnue)
      prev = date
      continue
    }

    let puissance = Number(valeur)
    if (isNaN(puissance)) continue

    entries.push({ date, puissance, duree: date.diff(prev) })
    prev = date
  }

  // Supprimer les entrées pour lesquelles on n'a pas de prix
  entries = entries.filter((e) => e.date >= minDate)

  if (!entries.length) {
    throw new Error('Aucune donnée utilisable dans le fichier chargé')
  }

  return entries
}
