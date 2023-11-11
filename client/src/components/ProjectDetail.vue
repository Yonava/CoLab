<template>
  <ReportDetail
    v-if="selectedReport"
    :item="selectedReport"
  />
   <div
      v-else
      class="justify-center d-flex"
      style="width: 100%; height: 100%;"
    >
      <v-icon style="font-size: 35vw; opacity: 0.1;">
        mdi-file-document-outline
      </v-icon>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useState } from '../stores/state'
import ReportDetail from '../components/ReportDetail.vue'

const { selectedReport } = storeToRefs(useState())
</script>