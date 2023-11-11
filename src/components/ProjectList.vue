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
    <div
      style="width: 95%; height: 90vh; background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: auto"
    >
      <!-- item box -->
      <div
        v-for="report in reports"
        :key="report.name"
        style="display: flex; flex-direction: column; align-items: center;"

      >
        <div
          @click="selectedReport = report"
          style="`display: flex; flex-direction: row; width: 100%; padding: 15px;`"
          :class="[
            selectedReport === report ? 'selected-item' : '',
            'list-item'
          ]"
        >
          <ListItem :report="report" />
        </div>
        <div style="width: 95%; height: 1px; background: rgba(255,255,255,0.3);"></div>
      </div>
    </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useState } from '../stores/state'
import { storeToRefs } from 'pinia'
import ListItem from '../components/ListItem.vue'

const { reports, selectedReport } = storeToRefs(useState())
</script>

<style scoped>
.selected-item {
  background-color: rgba(255, 255, 255, 0.1);
}

.list-item {
  transition: background-color 0.2s ease-in-out;
}

.list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

</style>