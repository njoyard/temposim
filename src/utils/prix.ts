import { DateTime } from 'luxon'

import PlageHeuresCreuses from './plage-hc'
import { PeriodeTarifaire } from './types'

export const periodes: PeriodeTarifaire[] = [
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
  },
  {
    debut: '2024-02-01T00:00:00+01:00',

    base: 0.2516,

    hc: 0.2068,
    hp: 0.27,

    tempo: [
      { hc: 0.1296, hp: 0.1609 },
      { hc: 0.1486, hp: 0.1894 },
      { hc: 0.1568, hp: 0.7562 }
    ]
  },
  {
    debut: '2025-02-01T00:00:00+01:00',

    base: 0.2264,

    hc: 0.1861,
    hp: 0.243,

    tempo: [
      { hc: 0.1166, hp: 0.1448 },
      { hc: 0.1337, hp: 0.1705 },
      { hc: 0.1411, hp: 0.6808 }
    ]
  }
]

export const hcTempo = new PlageHeuresCreuses(22, 6)

export const minDate = DateTime.fromMillis(
  Math.min(...periodes.map((p) => DateTime.fromISO(p.debut).toMillis()))
)
