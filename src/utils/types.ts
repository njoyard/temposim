import { DateTime, Duration } from 'luxon'

import PlageHeuresCreuses from './plage-hc'

type Tarif = {
  hp: number
  hc: number
}

export type PeriodeTarifaire = {
  debut: string
  base: number
  tempo: Tarif[]
} & Tarif

export type FormInput = {
  fichier: File
  hc: PlageHeuresCreuses[]
}

export type MesureConsommation = {
  date: DateTime
  duree: Duration
  puissance: number
}

export type JourTempo = {
  date: DateTime
  couleur: number
}

export type Option =
  | 'base'
  | 'hchp'
  | 'hp'
  | 'hc'
  | 'tempo'
  | 'hpbleu'
  | 'hcbleu'
  | 'hpblanc'
  | 'hcblanc'
  | 'hprouge'
  | 'hcrouge'

export type ConsoKey = `conso_${Option}`
export type CoutKey = `cout_${Option}`

export type MesureCout = {
  date: DateTime
  couleur: number
} & {
  [key in ConsoKey]: number
} & {
  [key in CoutKey]: number
}

export type Point = {
  ts: number
  valeur: number
}

export type TypeSerie = 'conso' | 'cout'

export type Serie = {
  option: Option
  type: TypeSerie
  points: Point[]
}

export type Pas = 'month' | 'year' | 'tempo' | 'tarif'

export type JeuDonnees = {
  pas: Pas
  series: Serie[]
}

export type Donnees = {
  conso: MesureConsommation[]
  cout: MesureCout[]
  couleurs: JourTempo[]
  donneesGraphique: JeuDonnees[]
} & FormInput
