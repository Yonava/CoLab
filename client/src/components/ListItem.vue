<template>
  <div style="width: 100%;">
    <div
      :style="{
        fontWeight: 900,
        fontSize: '1.6em',
        lineHeight: 1,
        display: 'flex',
        flexDirection: 'row',
      }"
    >

      <!-- primary title -->
      <span
        :style="{
          whitespace: 'nowrap'
        }"
      >

        {{ report.name }}

        <v-tooltip
          :disabled="smAndDown || !report.name"
          activator="parent"
          location="bottom"
        >
          Report Title
        </v-tooltip>

      </span>

      <v-spacer></v-spacer>

      <!-- secondary text -->
      <span
        :style="{
          fontWeight: 300,
          fontSize: '0.6em',
        }"
      >

        {{ report.date }}

        <v-tooltip
          :disabled="smAndDown || !report.date"
          activator="parent"
          location="bottom"
        >
          Project Date
        </v-tooltip>

      </span>

    </div>

    <div style="display: flex; flex-direction: row; padding-top: 20px; align-items: center; gap: 4px">
      <div
        style="display: flex; flex-direction: row; align-items: center; gap: 4px; background: rgba(255, 255,255, 0.2)"
        class="px-2 rounded-lg"
      >
        <v-icon>
          mdi-account
        </v-icon>
        <span style="font-size: 1.25em; margin: 0px">
          {{ report.client }}
        </span>
      </div>
      <v-spacer></v-spacer>
      <v-sheet
        v-if="report.status"
        style="display: flex; flex-direction: row; align-items: center; gap: 4px;"
        :color="statusColor"
        class="px-2 rounded-lg"
      >
        <span style="font-size: 1.25em">
          {{ report.status }}
        </span>
        <v-icon>
          mdi-{{ statusIcon }}
        </v-icon>
      </v-sheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

const { smAndDown } = useDisplay()

const props = defineProps<{
  report: {
    name: string
    client: string
    date: string
    status: string
    desc: string
  }
}>()

const statusColor = computed(() => {
  if (props.report.status === 'Complete') {
    return 'green'
  } else if (props.report.status === 'Pending Approval') {
    return 'orange-darken-3'
  } else {
    return 'red'
  }
})

const statusIcon = computed(() => {
  if (props.report.status === 'Complete') {
    return 'check-circle'
  } else if (props.report.status === 'Pending Approval') {
    return 'clock'
  } else {
    return 'alert-circle'
  }
})

</script>


<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 300;
}
</style>