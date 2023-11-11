<template>
  <div style="height: 100vh; position: relative;">
    <!-- top area -->
    <div
      style="padding: 15px; display: flex; flex-direction: row; align-items: center; gap: 10px;"
    >
      <h1 style="font-size: 2.7em">
        CoLab
      </h1>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-sort</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="search = !search"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-sheet
        v-if="search"
        style="position: absolute; top: 90px; right: 10px; z-index: 1000; padding: 15px; border-radius: 10px;"
        elevation="18"
      >
        <h1 class="mb-2">
          Find Report
        </h1>
        <v-text-field
          v-model="filter"
          variant="outlined"
          placeholder="Search"
          style="width: 200px;"
        ></v-text-field>
      </v-sheet>

      <v-btn icon
        @click="addReport()"
      >
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
        v-for="report in filteredReports"
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
import { ref } from 'vue'
import { useState } from '../stores/state'
import { storeToRefs } from 'pinia'
import ListItem from '../components/ListItem.vue'

const search = ref(false)

const { reports, selectedReport, filter, filteredReports } = storeToRefs(useState())
const { addReport } = useState()
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