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
import { type FormInput, type PeriodeTarifaire, type TarifCalcul } from '../utils/types'
import { tarifPerso } from '../utils/prix'

const emit = defineEmits<{
  (e: 'change', data?: FormInput): void
}>()

const afficherAide: Ref<boolean> = ref(false)

const fichier: Ref<File | null> = ref(null)

const tarif: Ref<TarifCalcul> = ref('edf-historique')

const perso: Ref<PeriodeTarifaire> = ref(tarifPerso)

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

const validation = {
  nombre: (v: number) => !isNaN(Number(v)) || 'Nombre incorrect'
}

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

  const dureeValide = duree.value === 8
  const fichierPresent = fichier.value !== null
  const tarifValide = tarif.value !== 'custom' || [
    perso.value.base,
    perso.value.hp,
    perso.value.hc,
    ...perso.value.tempo.map(t => t.hc),
    ...perso.value.tempo.map(t => t.hp),
  ].every((v) => !isNaN(Number(v)))

  if (dureeValide && fichierPresent && tarifValide) {
    let data: FormInput = {
      fichier: fichier.value as File,
      hc: heuresCreuses,
      tarif: tarif.value
    }

    if (tarif.value === 'custom') {
      data.perso = {
        debut: perso.value.debut,
        base: Number(perso.value.base),
        hc: Number(perso.value.hc),
        hp: Number(perso.value.hp),
        tempo: perso.value.tempo.map(t => ({
          hc: Number(t.hc),
          hp: Number(t.hp)
        }))
      }
    }

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

  <h4 class="my-2">Tarifs</h4>

  <p class="my-4">
    <v-btn-toggle
      v-model="tarif"
      class="mr-16"
      variant="outlined"
      density="compact"
      mandatory
    >
      <v-tooltip text="Tarifs historiques EDF" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" size="x-small" value="edf-historique"
            >Historique EDF</v-btn
          >
        </template>
      </v-tooltip>

      <v-tooltip text="Tarifs actuels EDF" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" size="x-small" value="edf-actuel"
            >Actuel EDF</v-btn
          >
        </template>
      </v-tooltip>

      <!--
        <v-tooltip text="Tarifs personnalisés" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" size="x-small" value="custom"
              >Personnalisé</v-btn
            >
          </template>
        </v-tooltip>
      -->

    </v-btn-toggle>
  </p>

  <p class="my-4 text-medium-emphasis">
    <span v-if="tarif === 'edf-historique'">
      L'historique du tarif bleu EDF sera utilisé pour le calcul&nbsp;: chaque consommation passée utilisera le tarif qui était en vigueur à ce moment.
    </span>

    <span v-if="tarif === 'edf-actuel'">
      Le tarif bleu EDF actuel sera utilisé pour toutes les consommation passées.
    </span>

    <template v-if="tarif === 'custom'">
      <span>
        Utiliser les tarifs personnalisés suivants (en €/kWh TTC)&nbsp;:
      </span>
      <div>
        <div class="d-flex">
          <v-text-field
            label="Base"
            v-model="perso.base"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
          <v-text-field
            label="Heures creuses"
            v-model="perso.hc"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
          <v-text-field
            label="Heures pleines"
            v-model="perso.hp"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
        </div>
        <div class="d-flex">
          <v-text-field
            label="HC Bleu"
            v-model="perso.tempo[0].hc"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
          <v-text-field
            label="HP Bleu"
            v-model="perso.tempo[0].hp"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
          <v-text-field
            label="HC Blanc"
            v-model="perso.tempo[1].hc"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
          <v-text-field
            label="HP Blanc"
            v-model="perso.tempo[1].hp"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
          <v-text-field
            label="HC Rouge"
            v-model="perso.tempo[2].hc"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
          <v-text-field
            label="HP Rouge"
            v-model="perso.tempo[2].hp"
            class="mr-2"
            hide-details="auto"
            :rules="[validation.nombre]"
          />
        </div>
      </div>
    </template>
  </p>

  <h4 class="my-2">Plages d'heures creuses</h4>

  <p class="my-4">Spécifiez ci-dessous votre ou vos plages d'heures creuses.</p>

  <p class="my-4 text-medium-emphasis">
    Note : ces plages ne s'appliquent qu'à l'option Heures Creuses. L'option
    Tempo a une plage fixe (de 22h à 6h).
  </p>

  <div class="d-flex align-top">
    <v-icon icon="fas fa-clock" color="grey-darken-1" class="ml-1 mr-4 mt-4" />

    <div class="d-flex flex-wrap align-center">
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

      <v-tooltip
        v-if="heuresCreuses.length === 1"
        text="Ajouter une 2ème plage"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="fas fa-plus"
            size="x-small"
            @click="deuxiemePlage"
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
          />
        </template>
      </v-tooltip>
    </div>
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
    demandant à vos voisins. Le gestionnaire de réseau vous attribue les plages
    d'heures creuses en fonction des besoins du réseau, et il n'est pas possible
    de les choisir ni de les modifier. Vous pouvez vous référer aux
    <a href="https://www.comparawatt.fr/heures-creuses/" target="_blank"
      >plages d'heures creuses chez Comparawatt</a
    >
    pour vous faire une idée des plages possibles dans votre région.
  </p>

  <Help v-model="afficherAide" />
</template>
