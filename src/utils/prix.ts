import { DateTime } from 'luxon'

type TarifTempo = {
  hp: number
  hc: number
}

export type Periode = {
  debut: string
  base: number
  hp: number
  hc: number
  tempo: TarifTempo[]
}

// Tarifs récupérés depuis ce PDF (et ses versions historiques sur archive.org) :
// https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille_prix_Tarif_Bleu.pdf
export const periodes: Periode[] = [
  {
    debut: '2022-02-01T00:00:00+01:00',

    base: 0.174,

    hc: 0.147,
    hp: 0.1841,

    tempo: [
      { hc: 0.0862, hp: 0.1272 },
      { hc: 0.1112, hp: 0.1653 },
      { hc: 0.1222, hp: 0.5486 }
    ]
  },
  {
    debut: '2022-08-01T00:00:00+01:00',

    base: 0.174,

    hc: 0.147,
    hp: 0.1841,

    tempo: [
      { hc: 0.0862, hp: 0.1272 },
      { hc: 0.1112, hp: 0.1653 },
      { hc: 0.1222, hp: 0.5486 }
    ]
  },
  {
    debut: '2023-02-01T00:00:00+01:00',

    base: 0.2062,

    hc: 0.1615,
    hp: 0.2228,

    tempo: [
      { hc: 0.097, hp: 0.1249 },
      { hc: 0.114, hp: 0.1508 },
      { hc: 0.1216, hp: 0.6712 }
    ]
  },
  {
    debut: '2023-08-01T00:00:00+01:00',

    base: 0.2276,

    hc: 0.1828,
    hp: 0.246,

    tempo: [
      { hc: 0.1056, hp: 0.1369 },
      { hc: 0.1246, hp: 0.1654 },
      { hc: 0.1328, hp: 0.7324 }
    ]
  }
]

export const hpTempo = [6, 22]

export const minDate = DateTime.fromMillis(
  Math.min(...periodes.map((p) => DateTime.fromISO(p.debut).toMillis()))
)
