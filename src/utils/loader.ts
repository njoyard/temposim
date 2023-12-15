import parseConsoCSV, { ConsoEntry } from './parser'
import getCouleursTempo, { JourTempo } from './api-tempo'

type LoadedData = {
  entries: ConsoEntry[]
  couleurs: JourTempo[]
}

export default function loadFile(
  file: File,
  onProgress: (msg: string) => void
): Promise<LoadedData> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.addEventListener('error', () => {
      reject(new Error('Impossible de charger le fichier'))
    })

    reader.addEventListener('load', async () => {
      try {
        onProgress('Extraction des données CSV...')
        let entries = parseConsoCSV(reader.result as string)

        onProgress('Récupération des couleurs Tempo pour la période...')
        let couleurs = await getCouleursTempo(
          entries[0].date,
          entries[entries.length - 1].date
        )

        resolve({ entries, couleurs })
      } catch (e) {
        reject(e)
      }
    })

    onProgress('Lecture du fichier...')
    reader.readAsText(file)
  })
}
