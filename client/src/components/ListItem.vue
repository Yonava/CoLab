<template>
  <div style="width: 100%;">
    <div
      :style="{
        fontWeight: 900,
        fontSize: '2em',
        lineHeight: 1,
        display: 'flex',
        flexDirection: 'row',
      }"
      class="truncate"
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

    <div style="display: flex; flex-direction: row; padding-top: 20px;">
      <span style="font-size: 1.25em">
        {{ report.client }}
      </span>
      <v-spacer></v-spacer>
      <span style="font-size: 1.25em">
        {{ report.status }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

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
</script>


<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 300;
}
</style>