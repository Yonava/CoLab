<template>
  <div style="height: 100vh; position: relative;">
    <!-- top area -->
    <div
      style="padding: 15px; display: flex; flex-direction: row; align-items: center; gap: 10px;"
    >
      <h1 style="font-size: 2.7em">
        Reports
      </h1>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-sort</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

    </div>

    <!-- list box -->
    <div style="display: flex; justify-content: center; align-items: center;">
    <div style="width: 95%; height: 90vh; padding: 15px; background-color: rgba(255, 255, 255, 0.2); border-radius: 10px; overflow: auto">
      <!-- item box -->
      <div v-for="report in reports" :key="report.name">
        {{ reports  }}
      </div>
    </div>
    </div>

  </div>
</template>

<script setup lang="ts">
// import { setSelectedItem } from './SetSelectedItem'
// import { useSheetManager } from '../../store/useSheetManager'
// import { storeToRefs } from 'pinia'

const reports = [
  {
    name: 'Report 1',
    client: 'Client 1',
    date: '2021-09-01',
    status: 'In Progress',
    desc: 'Lorem ipsum dolor sit amet, consectetur'
  },
  // generate 5 more reports
  ...Array.from({ length: 5 }, (_, i) => ({
    name: `Report ${i + 2}`,
    client: `Client ${i + 2}`,
    date: '2021-09-01',
    status: 'In Progress',
    desc: 'Lorem ipsum dolor sit amet, consectetur'
  }))
]
</script>