import { DateTime } from 'luxon'
import { JourTempo } from './types'

type JourTempoAPI = {
  dateJour: string
  codeJour: number
  periode: string
}

type PeriodesTempo = {
  [key: string]: JourTempo[]
}

const cache: PeriodesTempo = {}

async function getPeriodeTempo(periode: string): Promise<JourTempo[]> {
  if (!(periode in cache)) {
    let resp = await fetch(
      `https://www.api-couleur-tempo.fr/api/joursTempo?periode=${encodeURIComponent(
        periode
      )}`,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    )

    cache[periode] = ((await resp.json()) as JourTempoAPI[]).map((j) => ({
      date: DateTime.fromISO(j.dateJour),
      couleur: j.codeJour
    }))
  }

  return cache[periode]
}

export default async function getCouleursTempo(
  minDate: DateTime,
  maxDate: DateTime
): Promise<JourTempo[]> {
  let startYear = minDate.year
  if (minDate.month < 9) {
    startYear--
  }

  let endYear = maxDate.year
  if (maxDate.month < 9) {
    endYear--
  }

  let results = []
  for (let y = startYear; y <= endYear; y++) {
    results.push(getPeriodeTempo(`${y}-${y + 1}`))
  }

  return (await Promise.all(results)).reduce(
    (jours, joursPeriode) => [...jours, ...joursPeriode],
    []
  )
}
