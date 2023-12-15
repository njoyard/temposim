import { DateTime } from 'luxon'

import PlageHeuresCreuses from './plage-hc'
import { hcTempo, periodes } from './prix'
import {
  JourTempo,
  MesureConsommation,
  MesureCout,
  Option,
  Point,
  Serie,
  Unite
} from './types'

export function calculerTarifs(
  mesures: MesureConsommation[],
  couleurs: JourTempo[],
  plagesHC: PlageHeuresCreuses[]
): MesureCout[] {
  let out: MesureCout[] = []
  let couleursRestantes: JourTempo[] = [...couleurs]

  for (let mesure of mesures) {
    let jour = mesure.date
    if (jour.hour < hcTempo._fin.value) {
      // Les couleurs tempo basculent à 6h du matin, si l'heure est avant 6h la couleur est celle de la veille
      jour = mesure.date.minus({ days: 1 })
    }
    let jourTempo = couleursRestantes.find((j) => j.date.hasSame(jour, 'day'))
    if (!jourTempo || jourTempo.couleur === 0) continue

    // On vire les jours précédents pour accélérer le reste du process
    let index = couleursRestantes.indexOf(jourTempo)
    if (index > 0) couleursRestantes.splice(0, index)

    let tarif = periodes.find((p) => DateTime.fromISO(p.debut) < mesure.date)
    if (!tarif) continue

    let tarifTempo = tarif.tempo[jourTempo.couleur - 1]

    let duree = mesure.duree.milliseconds / 3600000
    let conso = (mesure.puissance / 1000) * duree
    let heure = mesure.date.hour + mesure.date.minute / 60

    // Note: on suppose qu'on n'a pas de mesure à cheval sur 2 couleurs tempo
    let ratioHCTempo = hcTempo.intersection(heure, heure + duree) / duree

    let ratioHC =
      plagesHC.reduce(
        (hc, plage) => hc + plage.intersection(heure, heure + duree),
        0
      ) / duree

    out.push({
      date: mesure.date,
      kwh: conso,
      couleur: jourTempo.couleur,
      base: conso * tarif.base,
      hchp: conso * ratioHC * tarif.hc + conso * (1 - ratioHC) * tarif.hp,
      tempo:
        conso * ratioHCTempo * tarifTempo.hc +
        conso * (1 - ratioHCTempo) * tarifTempo.hp
    })
  }

  return out
}

export function genererSeries(mesures: MesureCout[], unite: Unite): Serie[] {
  let options = ['base', 'hchp', 'tempo']
  let series: { [key: string]: Point[] } = {
    base: [],
    hchp: [],
    tempo: []
  }

  let cur: { [key: string]: Point } = {}
  let curTS = 0

  for (let mesure of mesures) {
    let ts = mesure.date.startOf(unite).toMillis()

    if (!curTS || curTS !== ts) {
      curTS = ts

      for (let key of options) {
        cur[key] = { ts, valeur: 0 }
        series[key].push(cur[key])
      }
    }

    for (let key of options) {
      cur[key].valeur += mesure[key as Option]
    }
  }

  return Object.keys(series).map((key) => ({
    option: key as Option,
    points: series[key]
  }))
}
