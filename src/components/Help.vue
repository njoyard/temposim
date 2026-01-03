<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const isVisible = computed({
  get() {
    return props.modelValue
  },

  set(v) {
    emit('update:modelValue', v)
  }
})
</script>

<template>
  <v-dialog v-model="isVisible" scrollable width="auto">
    <v-card>
      <v-card-title>Télécharger vos données de consommation</v-card-title>

      <v-divider></v-divider>

      <v-card-text style="max-height: 90vh">
        <p>
          <b>Attention</b>: depuis une mise à jour du site ENEDIS en 2025, il n'est
          plus possible de télécharger vos données de consommation sur une longue
          durée.  Vous pouvez toujours utiliser les fichiers téléchargés avant la
          modification pour la simulation.
        </p>

        <p class="mt-4">
          Pour utiliser des données récentes, il vous faudra générer un fichier de
          données consommation, soit manuellement, soit
          <a href="https://github.com/njoyard/enedis-download-script/" target="_blank">à l'aide de ce script</a>
          qui vous permettra de télécharger facilement les données sur de longues
          durées.
        </p>

        <p class="mt-4">
          Si vous préférez le générer vous-même, le fichier doit être au format CSV
          avec une ligne d'en-tête et 3 colonnes&nbsp;:
          <ul class="ml-4">
            <li>horodate&nbsp;: la date de mesure au format ISO</li>
            <li>duree_h&nbsp;: la durée de mesure en heures</li>
            <li>puissance_kw&nbsp;: la puissance moyenne sur la période mesurée en kW</li>
          </ul>
        </p>

        <p class="mt-4">
          Par exemple&nbsp;:
          <pre>
            horodate;duree_h;puissance_kw
            2025-01-01T00:00:00.000+01:00;0.5;2.53
            2025-01-01T00:30:00.000+01:00;0.5;3.15
            2025-01-01T01:00:00.000+01:00;0.5;4.28
            2025-01-01T01:30:00.000+01:00;0.5;4.65
            2025-01-01T02:00:00.000+01:00;0.5;4.62
          </pre>
        </p>

        <p class="mt-4">
          Attention, les nombres doivent être au format décimal US (avec un point décimal, et pas une virgule)
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn variant="text" @click="isVisible = false"> Fermer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.images {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.images img {
  max-width: 80vw;
}

.emph {
  font-weight: bold;
}
</style>
