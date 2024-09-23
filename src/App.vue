<script setup lang="ts">
import { Ref, ref } from 'vue'

import Form from './components/Form.vue'
import Graphique from './components/Graphique.vue'

import couleurs from './utils/couleurs'
import genererDonnees from './utils/generation'
import { adjMasculin, adjFeminin } from './utils/pas'
import { FormInput, Donnees, Pas } from './utils/types'

const version = import.meta.env.APP_VERSION

const loadingState: Ref<string | null> = ref(null)
const errorMessage: Ref<string | null> = ref(null)

const donnees: Ref<Donnees | null> = ref(null)

const pas: Ref<Pas> = ref('month')

const separer: Ref<boolean> = ref(false)

const majDonnees = async (input?: FormInput) => {
  loadingState.value = errorMessage.value = null

  if (input) {
    try {
      donnees.value = await genererDonnees(
        input,
        donnees.value,
        (msg) => (loadingState.value = msg)
      )

      loadingState.value = null
    } catch (e) {
      console.error(e)
      errorMessage.value = (e as Error).message
    }
  } else {
    donnees.value = null
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
              passée suivant les 3 options du Tarif Bleu EDF : Base, Heures
              Creuses et Tempo.
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
              &bull;
              <a href="/edf/tarifs-20240201.pdf" target="_blank"
                >1er février 2024</a
              >
            </p>
          </v-card-text>
        </v-card>

        <v-card class="my-4">
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

        <v-card v-if="donnees" class="my-4">
          <v-card-text>
            <div class="d-flex flex-row justify-space-around align-center">
              <v-label class="mr-2">Regrouper par</v-label>
              <v-btn-toggle
                v-model="pas"
                class="mr-16"
                variant="outlined"
                density="compact"
                mandatory
              >
                <v-tooltip text="Du 1er janvier au 31 décembre" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="x-small" value="year"
                      >Année civile</v-btn
                    >
                  </template>
                </v-tooltip>

                <v-tooltip text="Du 1er septembre au 31 août" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="x-small" value="tempo"
                      >Année Tempo</v-btn
                    >
                  </template>
                </v-tooltip>

                <v-tooltip
                  text="Démarre chaque 1er février et 1er août"
                  location="top"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="x-small" value="tarif"
                      >Période tarifaire</v-btn
                    >
                  </template>
                </v-tooltip>

                <v-tooltip
                  text="Afficher chaque mois séparément"
                  location="top"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="x-small" value="month"
                      >Mois</v-btn
                    >
                  </template>
                </v-tooltip>
              </v-btn-toggle>

              <v-switch
                v-model="separer"
                label="Séparer les tarifs"
                :color="couleurs.bleuFonce"
                density="compact"
                hide-details="auto"
              />
            </div>
          </v-card-text>
        </v-card>

        <v-card v-if="donnees" class="my-4">
          <v-card-title>
            Coût {{ adjMasculin[pas] }} TTC, hors abonnement
          </v-card-title>

          <v-card-text>
            <Graphique
              :pas="pas"
              :separer="separer"
              :donnees="donnees"
              type="cout"
            />
          </v-card-text>
        </v-card>

        <v-card v-if="donnees" class="my-4">
          <v-card-title> Consommation {{ adjFeminin[pas] }} </v-card-title>

          <v-card-text>
            <Graphique
              :pas="pas"
              :separer="separer"
              :donnees="donnees"
              type="conso"
            />
          </v-card-text>
        </v-card>

        <div class="text-center my-4 text-disabled">
          Version {{ version }} &bull;
          <a href="https://github.com/njoyard/temposim" target="_blank">
            <v-icon icon="fas fa-code-fork" size="x-small" /> Code source
          </a>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>
