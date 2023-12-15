<script setup lang="ts">
import { Ref, ref } from 'vue'

import Chart from './components/Chart.vue'
import Upload from './components/Upload.vue'

const monthSeries: Ref<null | object> = ref(null)
const yearSeries: Ref<null | object> = ref(null)

const updateSeries = (data) => {
  monthSeries.value = data && data.month
  yearSeries.value = data && data.year
}
</script>

<template>
  <v-layout>
    <v-main>
      <v-container>
        <v-card>
          <v-card-title>Simulation du coût de consommation EDF</v-card-title>
          <v-card-text>
            <p>
              Cette application permet de simuler, à partir de vos données de
              consommation Enedis, le coût de votre consommation électrique
              suivant les 3 options du Tarif Bleu EDF : Base, Heures Creuses et
              Tempo.
            </p>
            <p class="mt-4">
              Vos données ne seront ni téléchargées ni utilisées pour quoi que
              ce soit d'autre que le calcul des coûts. Tout s'exécute dans votre
              navigateur, sur votre ordinateur.
            </p>
            <p class="mt-4">
              Attention: le coût de l'abonnement n'est pas inclus dans cette
              simulation (puisqu'il dépend de la puissance souscrite). Par
              ailleurs, seules les consommations depuis le 1er février 2022
              seront prises en compte.
            </p>
            <p class="mt-4">
              Grilles tarifaires utilisées :
              <a href="/edf/tarifs-20220201.pdf" target="_blank"
                >1er février 2022</a
              >
              &bull;
              <a href="/edf/tarifs-20220801.pdf" target="_blank"
                >1er août 2022</a
              >
              &bull;
              <a href="/edf/tarifs-20230201.pdf" target="_blank"
                >1er février 2023</a
              >
              &bull;
              <a href="/edf/tarifs-20230801.pdf" target="_blank"
                >1er août 2023</a
              >
            </p>
          </v-card-text>
        </v-card>

        <Upload @series-ready="updateSeries" />

        <Chart
          v-if="monthSeries"
          title="Coût mensuel TTC hors abonnement"
          unit="month"
          :series="monthSeries"
        />

        <Chart
          v-if="yearSeries"
          title="Coût annuel TTC hors abonnement"
          unit="year"
          :series="yearSeries"
        />

        <div class="text-center">
          <a href="https://github.com/njoyard/temposim" target="_blank">
            <v-icon icon="fas fa-github" /> Code source
          </a>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>
