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
          Pour télécharger vos données de consommations, accédez à votre espace
          client Enedis:
          <a href="https://mon-compte-particulier.enedis.fr/" target="_blank"
            >https://mon-compte-particulier.enedis.fr/</a
          >.
        </p>

        <p class="mt-4">
          Assurez-vous tout d'abord que vous avez activé la collecte des données
          en sélectionnant
          <span class="emph">Gérer l'accès à mes données</span>
          dans le menu, puis en vérifiant que la collecte de la consommation
          horaire est activée.
        </p>

        <div class="images">
          <img
            class="elevation-10 my-8"
            src="../assets/enedis/gerer-acces-donnees-menu.png"
          />
          <v-icon icon="fas fa-arrow-right" class="mx-8" size="x-large" />
          <img
            class="elevation-10 my-8"
            src="../assets/enedis/gerer-acces-donnees-parametres.png"
          />
        </div>

        <p>
          Accédez ensuite à <span class="emph">Suivre mes mesures</span> dans le
          menu puis cliquez sur
          <span class="emph">Télécharger mes données</span>.
        </p>

        <div class="images">
          <img
            class="elevation-10 my-8"
            src="../assets/enedis/suivre-mesures-menu.png"
          />
          <v-icon icon="fas fa-arrow-right" class="mx-8" size="x-large" />
          <img
            class="elevation-10 my-8"
            src="../assets/enedis/suivre-mesures-telecharger.png"
          />
        </div>

        <p>
          Choisissez ensuite le point de livraison si vous en avez plusieurs,
          assurez-vous que le type de données
          <span class="emph">Consommation horaire</span> est sélectionné,
          choisissez une plage de dates puis cliquez sur
          <span class="emph">Télécharger mes données</span>.
        </p>

        <div class="images">
          <img
            class="elevation-10 my-8"
            src="../assets/enedis/suivre-mesures-options.png"
          />
        </div>

        <p>
          La génération du fichier peut prendre un certain temps. Revenez sur la
          page <span class="emph">Suivre mes mesures</span>, puis cliquez sur
          <span class="emph">Voir mes téléchargements</span>. Une fois le
          fichier disponible, vous pouvez le télécharger en cliquant sur le
          bouton sur la droite.
        </p>

        <div class="images">
          <img
            class="elevation-10 my-8"
            src="../assets/enedis/telechargements.png"
          />
        </div>
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
