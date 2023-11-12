<template>
  <div>
    <div style="width: 100%; height: 100vh; position: absolute; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.1); pointer-events: none;"></div>

  <div
    style="position: relative;"
  >    <!-- top area -->
    <div
      class="pa-2"
      style="display: flex; flex-direction: row; align-items: center; gap: 10px;  position: sticky; top: 0; z-index: 1000; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);"
    >
      <h1
        style="font-size: 2.2em; background: rgb(0, 0, 0, 0.2)"
        class="px-5 rounded-xl"
      >
        {{ filteredReports.length }} Reports
      </h1>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-sort</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="search = !search"
      >
        <v-icon v-if="!search">mdi-magnify</v-icon>
        <v-icon v-if="search">mdi-close</v-icon>
      </v-btn>

      <v-sheet
        v-if="search"
        style="position: absolute; top: 85px; right: 10px; z-index: 1000; padding: 15px; border-radius: 10px;"
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
        @click="makeNewReport"
        color="green"
        :loading="loadingNewItem"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>



    </div>

    <!-- list box -->
    <div style="display: flex; justify-content: center; align-items: center; width: 100%">
    <div
      v-if="filteredReports.length !== 0"
      style="background-color: rgba(255, 255, 255, 0.1); overflow: auto; width: 100%"
    >
      <!-- item box -->
      <div
        v-for="report in filteredReports"
        :key="report.name"
        style="display: flex; flex-direction: column; align-items: center; width: 100%"
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
        <div style="width: 100%; height: 1px; background: rgba(90, 90, 90, 0.3);"></div>
      </div>
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
const loadingNewItem = ref(false)

const { reports, selectedReport, filter, filteredReports } = storeToRefs(useState())
const { addReport } = useState()

const makeNewReport = async () => {
  loadingNewItem.value = true
  await addReport()
  loadingNewItem.value = false
}
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