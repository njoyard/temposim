import { DateTime } from 'luxon'
import { JourTempo } from './api-tempo'
import { ConsoEntry } from './parser'
import { hpTempo, periodes } from './prix'

type TarifEntry = {
  date: DateTime
  kwh: number
  couleur: number
  coutBase: number
  coutHCHP: number
  coutTempo: number
}

export function calculerTarifs(
  entries: ConsoEntry[],
  couleurs: JourTempo[]
): TarifEntry[] {
  let out: TarifEntry[] = []

  for (let entry of entries) {
    let jour = entry.date
    if (jour.hour < 6) {
      // Les couleurs tempo basculent à 6h du matin, si l'heure est avant 6h la couleur est celle de la veille
      jour = entry.date.minus({ days: 1 })
    }

    let jourTempo = couleurs.find((j) => j.date.hasSame(jour, 'day'))
    if (!jourTempo || jourTempo.couleur === 0) continue

    // On vire les jours précédents pour accélérer le process
    let index = couleurs.indexOf(jourTempo)
    if (index > 0) couleurs.splice(0, index)

    let tarif = periodes.find((p) => DateTime.fromISO(p.debut) < entry.date)
    if (!tarif) continue

    let conso = (entry.puissance / 1000) * (entry.duree.milliseconds / 3600000)
    let heure = entry.date.hour + entry.date.minute / 60

    // TODO: les heures HCHP sont pas les mêmes qu'en tempo
    // TODO: des anciens relevés peuvent avoir des intervalles qui chevauchent la bascule HP/HC
    let heuresPleines = heure >= hpTempo[0] && heure < hpTempo[1] ? 1 : 0

    out.push({
      date: entry.date,
      kwh: conso,
      couleur: jourTempo.couleur,
      coutBase: conso * tarif.base,
      coutHCHP:
        conso * heuresPleines * tarif.hp +
        conso * (1 - heuresPleines) * tarif.hc,
      coutTempo:
        conso * heuresPleines * tarif.tempo[jourTempo.couleur - 1].hp +
        conso * (1 - heuresPleines) * tarif.tempo[jourTempo.couleur - 1].hc
    })
  }

  return out
}

const seriesDefs: { [key: string]: (entry: TarifEntry) => number } = {
  base: (entry: TarifEntry) => entry.coutBase,
  hchp: (entry: TarifEntry) => entry.coutHCHP,
  tempo: (entry: TarifEntry) => entry.coutTempo,
  bleu: (entry: TarifEntry) => (entry.couleur === 1 ? entry.coutTempo : 0),
  blanc: (entry: TarifEntry) => (entry.couleur === 2 ? entry.coutTempo : 0),
  rouge: (entry: TarifEntry) => (entry.couleur === 3 ? entry.coutTempo : 0)
}

export type Point = {
  ts: number
  value: number
}

export function genererSeries(entries: TarifEntry[], unit: 'month' | 'year') {
  let seriesKeys = Object.keys(seriesDefs)
  let series: { [key: string]: Point[] } = {}
  let cur: { [key: string]: Point } = {}

  let curTS = 0

  for (let id of seriesKeys) {
    series[id] = []
  }

  for (let entry of entries) {
    let ts = entry.date.startOf(unit).toMillis()

    if (!curTS || curTS !== ts) {
      curTS = ts
      for (let id of seriesKeys) {
        cur[id] = { ts, value: 0 }
        series[id].push(cur[id])
      }
    }

    for (let id of seriesKeys) {
      cur[id].value += seriesDefs[id](entry)
    }
  }

  return series
}
