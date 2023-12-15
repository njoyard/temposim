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

export type MesureCout = {
  date: DateTime
  kwh: number
  couleur: number
  base: number
  hchp: number
  tempo: number
}

export type Point = {
  ts: number
  valeur: number
}

export type Option = 'base' | 'hchp' | 'tempo'

export type Serie = {
  option: Option
  points: Point[]
}

export type Unite = 'month' | 'year'

export type JeuDonnees = {
  unite: Unite
  series: Serie[]
}

export type Donnees = {
  conso: MesureConsommation[]
  cout: MesureCout[]
  couleurs: JourTempo[]
  donneesGraphique: JeuDonnees[]
} & FormInput
