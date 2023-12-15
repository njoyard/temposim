<script setup lang="ts">
import { Ref, ref } from 'vue'
import loadFile from '../utils/loader'
import { calculerTarifs, genererSeries } from '../utils/calcul'
import Chart from './Chart.vue'

const loading: Ref<boolean | string> = ref(false)
const error: Ref<boolean | string> = ref(false)

const monthSeries: Ref<null | object> = ref(null)
const yearSeries: Ref<null | object> = ref(null)

const handleFile = async (files: File[]) => {
  if (!files.length) {
    monthSeries.value = null
    yearSeries.value = null
    error.value = false

    return
  }

  try {
    let data = await loadFile(files[0], (msg) => (loading.value = msg))

    loading.value = 'Calcul des coûts des différents tarifs...'
    let tarifs = calculerTarifs(data.entries, data.couleurs)

    loading.value = 'Génération des séries de données'
    monthSeries.value = genererSeries(tarifs, 'month')
    yearSeries.value = genererSeries(tarifs, 'year')
  } catch (e) {
    error.value = (e as Error).message
  }

  loading.value = false
}
</script>

<template>
  <v-card>
    <v-card-title>Simulation du coût de consommation EDF</v-card-title>
    <v-card-text>
      <p>
        Cette application permet de simuler le coût de votre consommation
        électrique suivant les 3 options du Tarif Bleu EDF : Base, Heures
        Creuses et Tempo.
      </p>
      <p>
        Téléchargez vos données de consommation horaire sur le site Enedis (<a
          href="#"
          >comment faire ?</a
        >) puis importez le fichier ci-dessous. Assurez-vous d'avoir fait
        l'analyse sur une portion significative de l'année (au moins 6 mois dont
        la moitié de l'hiver et la moitié de l'été) avant de prendre toute
        décision !
      </p>
      <p>
        Note: cette application ne télécharge pas vos données. Tout s'exécute
        dans votre navigateur, sur votre ordinateur.
      </p>
      <p>
        Attention: le coût de l'abonnement n'est pas inclus dans cette
        simulation. Par ailleurs, seules les consommations depuis le 1er février
        2022 seront prises en compte.
      </p>

      <v-file-input
        accept="text/csv"
        show-size
        label="Fichier de consommation CSV (Enedis_Conso_Heure_xxx.CSV)"
        @update:modelValue="handleFile"
      ></v-file-input>

      <div v-if="error">Erreur: {{ error }}</div>
      <div v-if="loading">{{ loading }}</div>
    </v-card-text>
  </v-card>

  <Chart
    v-if="monthSeries"
    title="Coût mensuel"
    unit="month"
    :series="monthSeries"
  />

  <Chart
    v-if="yearSeries"
    title="Coût annuel"
    unit="year"
    :series="yearSeries"
  />
</template>
