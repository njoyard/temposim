import { DateTime, Duration } from 'luxon'

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

type MesureConsommationTemp = {
  date: DateTime
  duree?: Duration
  puissance: number
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

  let entries: MesureConsommationTemp[] = []

  for (let [horodate, valeur] of data) {
    let date = DateTime.fromISO(horodate)
    let puissance = Number(valeur)

    if (!date.isValid || isNaN(puissance)) continue

    if (entries.length) {
      let prev = entries[entries.length - 1]
      prev.duree = date.diff(prev.date)
    }

    entries.push({ date, puissance })

    // TODO les plages de mesures FINISSENT à l'horodate du CSV !!!
  }

  // Supprimer les entrées pour lesquelles on n'a pas de prix ou de durée
  entries = entries.filter((e) => e.duree && e.date >= minDate)

  if (!entries.length) {
    throw new Error('Aucune donnée utilisable dans le fichier chargé')
  }

  return entries as MesureConsommation[]
}
