<template>
  <div>
    <div
      v-if="!syncStatus"
      class="d-flex flex-row align-center"
      style="height: 25px; white-space: nowrap;"
    >
      <v-progress-circular
        indeterminate
        class="mr-2"
        size="20"
      ></v-progress-circular>
      <p>
        saving changes...
      </p>
    </div>
    <p
      v-else
      style="height: 25px; white-space: nowrap;"
    >
      <v-icon>
        mdi-cloud-check-variant-outline
      </v-icon>
      saved to cloud
    </p>
  </div>
</template>

<script setup lang="ts">
import { useState } from '../stores/state'
import { storeToRefs } from 'pinia'

const { syncStatus } = storeToRefs(useState())
</script>