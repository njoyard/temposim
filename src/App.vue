<script setup lang="ts">
import Upload from './components/Upload.vue'
</script>

<template>
  <v-layout>
    <v-main>
      <v-container>
        <Upload />
      </v-container>
      <v-footer>
        <div class="d-flex align-center">
          <a href="https://github.com/njoyard/temposim" target="_blank">
            <v-icon icon="fas fa-github" /> Code source
          </a>
        </div>
      </v-footer>
    </v-main>
  </v-layout>
</template>
