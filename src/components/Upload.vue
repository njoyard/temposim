<script setup lang="ts">
import { Ref, ref } from 'vue'
import loadFile from '../utils/loader'
import { calculerTarifs, genererSeries } from '../utils/calcul'
import Help from './Help.vue'

const emit = defineEmits(['seriesReady'])

const loading: Ref<boolean | string> = ref(false)
const error: Ref<boolean | string> = ref(false)
const showHelp = ref(false)

const handleFile = async (files: File[]) => {
  error.value = false

  if (!files.length) {
    emit('seriesReady', null)
    return
  }

  try {
    let data = await loadFile(files[0], (msg) => (loading.value = msg))

    loading.value = 'Calcul des coûts des différents tarifs...'
    await new Promise((r) => setTimeout(r, 0))
    let tarifs = calculerTarifs(data.entries, data.couleurs)

    loading.value = 'Génération des séries de données'
    await new Promise((r) => setTimeout(r, 0))

    emit('seriesReady', {
      month: genererSeries(tarifs, 'month'),
      year: genererSeries(tarifs, 'year')
    })
  } catch (e) {
    emit('seriesReady', null)
    error.value = (e as Error).message
  }

  loading.value = false
}
</script>

<template>
  <v-card class="mt-8">
    <v-card-title>Fichier de consommation Enedis</v-card-title>
    <v-card-text>
      <p>
        Téléchargez vos données de consommation horaire sur le site Enedis (<a
          href="#"
          @click.prevent="showHelp = true"
          >comment faire ?</a
        >) puis importez le fichier ci-dessous. Assurez-vous d'avoir fait
        l'analyse sur une portion significative de l'année (au moins 6 mois dont
        la moitié de l'hiver et la moitié de l'été) avant de prendre toute
        décision !
      </p>

      <v-file-input
        class="mt-4"
        accept="text/csv"
        show-size
        label="Fichier de consommation CSV (Enedis_Conso_Heure_xxx.csv)"
        @update:modelValue="handleFile"
      ></v-file-input>

      <v-alert v-if="error" type="error" variant="tonal">
        {{ error }}
      </v-alert>

      <v-banner v-if="loading">
        <template v-slot:prepend>
          <v-progress-circular indeterminate />
        </template>

        <v-banner-text>{{ loading }}</v-banner-text>
      </v-banner>
    </v-card-text>
  </v-card>

  <Help v-model="showHelp" />
</template>
