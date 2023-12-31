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
  Pas,
  CoutKey,
  ConsoKey,
  TypeSerie
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
      conso_base: conso,
      conso_hchp: conso,
      conso_hc: conso * ratioHC,
      conso_hp: conso * (1 - ratioHC),
      conso_hcbleu: jourTempo.couleur === 1 ? conso * ratioHCTempo : 0,
      conso_hpbleu: jourTempo.couleur === 1 ? conso * (1 - ratioHCTempo) : 0,
      conso_hcblanc: jourTempo.couleur === 2 ? conso * ratioHCTempo : 0,
      conso_hpblanc: jourTempo.couleur === 2 ? conso * (1 - ratioHCTempo) : 0,
      conso_hcrouge: jourTempo.couleur === 3 ? conso * ratioHCTempo : 0,
      conso_hprouge: jourTempo.couleur === 3 ? conso * (1 - ratioHCTempo) : 0,
      conso_tempo: conso,
      couleur: jourTempo.couleur,
      cout_base: conso * tarif.base,
      cout_hchp: conso * ratioHC * tarif.hc + conso * (1 - ratioHC) * tarif.hp,
      cout_hc: conso * ratioHC * tarif.hc,
      cout_hp: conso * (1 - ratioHC) * tarif.hp,
      cout_tempo:
        conso * ratioHCTempo * tarifTempo.hc +
        conso * (1 - ratioHCTempo) * tarifTempo.hp,
      cout_hcbleu:
        jourTempo.couleur === 1 ? conso * ratioHCTempo * tarifTempo.hc : 0,
      cout_hpbleu:
        jourTempo.couleur === 1
          ? conso * (1 - ratioHCTempo) * tarifTempo.hp
          : 0,
      cout_hcblanc:
        jourTempo.couleur === 2 ? conso * ratioHCTempo * tarifTempo.hc : 0,
      cout_hpblanc:
        jourTempo.couleur === 2
          ? conso * (1 - ratioHCTempo) * tarifTempo.hp
          : 0,
      cout_hcrouge:
        jourTempo.couleur === 3 ? conso * ratioHCTempo * tarifTempo.hc : 0,
      cout_hprouge:
        jourTempo.couleur === 3 ? conso * (1 - ratioHCTempo) * tarifTempo.hp : 0
    })
  }

  return out
}

export function genererSeries(mesures: MesureCout[], pas: Pas): Serie[] {
  let options = [
    'base',
    'hchp',
    'hp',
    'hc',
    'tempo',
    'hpbleu',
    'hcbleu',
    'hpblanc',
    'hcblanc',
    'hprouge',
    'hcrouge'
  ]

  let keys = []

  for (let option of options) {
    for (let type of ['cout', 'conso']) {
      keys.push(`${type}_${option}`)
    }
  }

  let series: { [key: string]: Point[] } = {}

  for (let key of keys) {
    series[key] = []
  }

  let cur: { [key: string]: Point } = {}
  let curTS = 0

  for (let mesure of mesures) {
    let ts = mesure.date.startOf(pas).toMillis()

    if (!curTS || curTS !== ts) {
      curTS = ts

      for (let key of keys) {
        cur[key] = { ts, valeur: 0 }
        series[key].push(cur[key])
      }
    }

    for (let key of keys) {
      cur[key].valeur += mesure[key as CoutKey | ConsoKey]
    }
  }

  return Object.keys(series).map((key) => ({
    option: key.replace(/^\w+_/, '') as Option,
    type: key.replace(/_\w+$/, '') as TypeSerie,
    points: series[key]
  }))
}
