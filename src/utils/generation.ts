import getCouleursTempo from './api-tempo'
import { calculerTarifs, genererSeries } from './calcul'
import { analyseCSV, chargerFichier } from './chargement'
import {
  Donnees,
  FormInput,
  JourTempo,
  JeuDonnees,
  MesureConsommation,
  Unite
} from './types'

let yieldToUI = (): Promise<void> => new Promise((r) => setTimeout(r, 0))

export default async function genererDonnees(
  input: FormInput,
  donnees: Donnees | null,
  onProgress: (msg: string) => void
): Promise<Donnees> {
  let conso: MesureConsommation[] = []
  let couleurs: JourTempo[] = []

  if (!donnees || donnees.fichier !== input.fichier) {
    onProgress('Chargement du contenu du fichier...')

    let csv = await chargerFichier(input.fichier)

    onProgress('Extraction des données de consommation...')
    await yieldToUI()

    conso = analyseCSV(csv)

    onProgress('Récupération des couleurs des jours Tempo...')

    couleurs = await getCouleursTempo(
      conso[0].date,
      conso[conso.length - 1].date
    )
  } else {
    conso = donnees.conso
    couleurs = donnees.couleurs
  }

  onProgress('Calcul du coût suivant les options tarifaires...')
  await yieldToUI()

  let cout = calculerTarifs(conso, couleurs, input.hc)

  onProgress('Génération des séries de données...')

  let donneesGraphique: JeuDonnees[] = []

  for (let unite of ['month', 'year'] as Unite[]) {
    await yieldToUI()

    donneesGraphique.push({
      unite,
      series: genererSeries(cout, unite)
    })
  }

  return {
    ...input,
    conso,
    couleurs,
    cout,
    donneesGraphique
  }
}
