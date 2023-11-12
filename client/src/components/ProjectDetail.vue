<template>
  <div style="overflow: auto">
    <img
      src="../assets/vector.svg"
      style="position: absolute; top: 10; right: -4%; width: 500px; height: 250px;"
    />

    <div
      v-if="user"
      style="position: absolute; top: 2%; right: 1%; display: flex; justify-content: center; align-items: center; background-color: #1d68ae; border-radius: 50px; flex-direction: row; gap: 6px; padding-left: 20px; border: 1px solid black"
    >
      <div style="text-align: right;">
        <div style="font-size: 1em; color: white; font-weight: bold; white-space: nowrap">
          {{ user.name }}
        </div>
        <v-spacer></v-spacer>
        <div style="font-size: 1em; color: white;">
          ID {{ user.id.slice(0, 8) }}
        </div>
      </div>

      <img
        :src="user.picture"
        style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid white;"
      />
    </div>

    <img
        src="../assets/Colab.svg"
        style="position: absolute; width: 500px; height: 70vh; bottom: 2%; right: -2%;"
      >


    <div v-if="selectedReport">
      <ReportDetail
        :item="selectedReport"
        :key="selectedReport.sysId"
      />
    </div>
    <div
      v-else
      class="justify-center d-flex"
      style="width: 100vh; height: 100vh;"
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

const { selectedReport, user } = storeToRefs(useState())
</script>