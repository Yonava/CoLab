<template>
  <div>
    <div style="width: 100%; height: 100vh; position: absolute; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.07); pointer-events: none;"></div>

  <div
    style="position: relative;"
  >    <!-- top area -->
    <div
      class="pa-2"
      style="display: flex; flex-direction: row; align-items: center; gap: 10px; background: rgb(43, 111, 189);  position: sticky; top: 0; z-index: 1000; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);"
    >
      <h1
        style="font-size: 2.2em; background: rgb(0, 0, 0, 0.2)"
        class="px-5 rounded-xl"
      >
        {{ filteredReports.length }} Reports
      </h1>
      <v-spacer></v-spacer>
      <v-menu :offset="[10, 30]">
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-icon>mdi-sort</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(prop, name) in sortProps"
            :key="name"
            @click="sortProp = prop"
          >
            <v-list-item-title>
              <v-icon v-if="sortProp === prop">mdi-check</v-icon>
              {{ name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu
        :offset="[10, 30]"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          </template>

          <v-sheet class="pt-4 px-4">
            <v-text-field
              v-model="filter"
              variant="outlined"
              placeholder="Search"
              style="width: 200px;"
            ></v-text-field>
          </v-sheet>

      </v-menu>

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

const loadingNewItem = ref(false)

const sortProps = {
  'Name': 'name',
  'Client': 'client',
  'Manager Email': 'managerEmail',
  'Status': 'status',
  'Start Date': 'date',
}

const { reports, selectedReport, filter, filteredReports, sortProp } = storeToRefs(useState())
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