<template>
  <div style="overflow: auto">
    <img
      src="../assets/vector.svg"
      style="position: absolute; top: 10; right: -4%; width: 500px; height: 250px;"
    />
    <div v-if="selectedReport" style="overflow: auto;">
      <ReportDetail
        :item="selectedReport"
        :key="selectedReport.sysId"
      />
    </div>
    <div
      v-else
      class="justify-center d-flex"
      style="width: 100%; height: 100%;"
    >
      <v-icon style="font-size: 35vw; opacity: 0.1;">
        mdi-file-document-outline
      </v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useState } from '../stores/state'
import ReportDetail from '../components/ReportDetail.vue'

const { selectedReport } = storeToRefs(useState())
</script>