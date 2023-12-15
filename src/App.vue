<script setup lang="ts">
import { Ref, ref } from 'vue'

import Form from './components/Form.vue'
import GraphiqueCout from './components/GraphiqueCout.vue'

import genererDonnees from './utils/generation'
import { FormInput, Donnees, Unite } from './utils/types'

const version = import.meta.env.APP_VERSION

const loadingState: Ref<string | null> = ref(null)
const errorMessage: Ref<string | null> = ref(null)

const data: Ref<Donnees | null> = ref(null)

const unite: Ref<Unite> = ref('month')

const majDonnees = async (input?: FormInput) => {
  loadingState.value = errorMessage.value = null

  if (input) {
    try {
      data.value = await genererDonnees(
        input,
        data.value,
        (msg) => (loadingState.value = msg)
      )

      loadingState.value = null
    } catch (e) {
      errorMessage.value = (e as Error).message
    }
  } else {
    data.value = null
  }
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
            <p class="mt-4 text-medium-emphasis">
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

        <v-card class="my-8">
          <v-card-text>
            <Form @change="majDonnees" />

            <v-alert
              v-if="loadingState"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              <template v-slot:prepend>
                <v-progress-circular indeterminate />
              </template>

              {{ loadingState }}
            </v-alert>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
        </v-card>

        <v-card v-if="data" class="my-8">
          <v-toolbar color="white">
            <v-toolbar-title>
              Coût {{ unite === 'month' ? 'mensuel' : 'annuel' }} TTC, hors
              abonnement
            </v-toolbar-title>

            <v-btn-toggle
              v-model="unite"
              class="mr-4"
              variant="outlined"
              density="compact"
            >
              <v-btn size="x-small" value="month">Mensuel</v-btn>
              <v-btn size="x-small" value="year">Annuel</v-btn>
            </v-btn-toggle>
          </v-toolbar>

          <v-card-text>
            <GraphiqueCout :unite="unite" :data="data" />
          </v-card-text>
        </v-card>

        <div class="text-center my-8 text-disabled">
          Version {{ version }} &bull;
          <a href="https://github.com/njoyard/temposim" target="_blank">
            <v-icon icon="fas fa-code-fork" size="x-small" /> Code source
          </a>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>
