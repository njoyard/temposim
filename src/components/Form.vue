<script setup lang="ts">
import {
  computed,
  ComputedRef,
  Ref,
  ref,
  shallowReactive,
  watchEffect
} from 'vue'

import Help from './Help.vue'
import PlageHeuresCreuses from '../utils/plage-hc'
import { FormInput } from '../utils/types'

const emit = defineEmits<{
  (e: 'change', data?: FormInput): void
}>()

const afficherAide: Ref<boolean> = ref(false)

const fichier: Ref<File | null> = ref(null)

const heuresCreuses = shallowReactive([
  new PlageHeuresCreuses(2, 7),
  new PlageHeuresCreuses(12.5, 15.5)
])

const duree: ComputedRef<number> = computed(() =>
  heuresCreuses.reduce(
    (total: number, plage: PlageHeuresCreuses) => total + plage.duree,
    0
  )
)

const deuxiemePlage = () =>
  heuresCreuses.length === 1 && heuresCreuses.push(new PlageHeuresCreuses(0, 0))
const unePlage = () => heuresCreuses.length === 2 && heuresCreuses.splice(1, 1)

const handleFile = async (files: File[]) => {
  fichier.value = files.length ? files[0] : null
}

const debounce = 500
let debounceTimeout = 0

watchEffect(() => {
  clearTimeout(debounceTimeout)

  if (duree.value === 8 && fichier.value !== null) {
    let data = { fichier: fichier.value, hc: heuresCreuses }
    debounceTimeout = setTimeout(() => emit('change', data), debounce)
  } else {
    debounceTimeout = setTimeout(() => emit('change'), debounce)
  }
})
</script>

<template>
  <h4 class="my-2">Fichier de consommation Enedis</h4>

  <p class="my-4">
    Téléchargez vos données de consommation horaire sur le site Enedis (<a
      href="#"
      @click.prevent="afficherAide = true"
      >comment faire ?</a
    >) puis importez le fichier ci-dessous. Assurez-vous d'avoir fait l'analyse
    sur une portion significative de l'année (au moins 6 mois dont la moitié de
    l'hiver et la moitié de l'été) pour avoir une estimation correcte.
  </p>

  <v-file-input
    prepend-icon="fas fa-plug"
    class="my-4"
    accept="text/csv"
    show-size
    label="Fichier de consommation CSV (Enedis_Conso_Heure_xxx.csv)"
    hide-details="auto"
    @update:modelValue="handleFile"
  ></v-file-input>

  <h4 class="my-2">Plages d'heures creuses</h4>

  <p class="my-4">Spécifiez ci-dessous votre ou vos plages d'heures creuses.</p>

  <p class="my-4 text-medium-emphasis">
    Note : ces plages ne s'appliquent qu'à l'option Heures Creuses. L'option
    Tempo a une plage fixe (de 22h à 6h).
  </p>

  <div class="d-flex align-center">
    <v-icon icon="fas fa-clock" color="grey-darken-1" class="mr-5" />
    <div v-for="plage in heuresCreuses" class="d-flex mr-8">
      <v-text-field
        label="Début"
        type="time"
        v-model="plage.debut"
        class="mr-2"
        hide-details="auto"
      />
      <v-text-field
        label="Fin"
        type="time"
        v-model="plage.fin"
        hide-details="auto"
      />
    </div>

    <v-tooltip v-if="heuresCreuses.length === 1" text="Ajouter une 2ème plage">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon="fas fa-plus"
          size="x-small"
          @click="deuxiemePlage"
          tooltip="Coucou"
        />
      </template>
    </v-tooltip>

    <v-tooltip v-if="heuresCreuses.length > 1" text="Supprimer la 2ème plage">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon="fas fa-minus"
          size="x-small"
          @click="unePlage"
          tooltip="Coucou"
        />
      </template>
    </v-tooltip>
  </div>

  <v-alert v-if="duree !== 8" type="warning" variant="tonal" class="my-4">
    <span v-if="isNaN(duree)">
      Les plages d'heures creuses sont incorrectes.
    </span>
    <span v-else>
      Attention, vous avez spécifié {{ duree }} heures creuses, il y en a
      normalement toujours 8.
    </span>
  </v-alert>

  <p class="mt-4">
    Si vous n'avez pas souscrit l'option Heures Creuses, il n'est
    malheureusement pas possible de savoir quelles plages vous auriez, même en
    demandant à vos voisins. Le gestionnaire de réseau vous attribe les plages
    d'heures creuses en fonction des besoins du réseau, et il n'est pas possible
    de les choisir ni de les modifier. Vous pouvez vous référer aux
    <a href="https://www.comparawatt.fr/heures-creuses/" target="_blank"
      >plages d'heures creuses chez Comparawatt</a
    >
    pour vous faire une idée des plages possibles dans votre région.
  </p>

  <Help v-model="afficherAide" />
</template>
