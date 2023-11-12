<template>
  <div style="overflow: auto">
    <DetailFrame :item="report">
      <template #main>

        <DetailHeader
          :item="report"
          placeholder="Report Name"
        ></DetailHeader>

        <DetailInput
          :item="report"
          prop="managerEmail"
          label="Manager Email"
          icon="email"
        />

        <DetailInput
          :item="report"
          prop="client"
          label="Client"
          icon="account"
        />

        <InputCoupler>

          <DetailInput
            :item="report"
            prop="date"
            icon="calendar-month"
            label="Date"
          />

          <DetailInput
            :item="report"
            prop="status"
            icon="check-circle"
            label="Status"
          />

        </InputCoupler>

      </template>
      <template #buttons>
        <v-btn
          @click="sendEmail"
          size="large"
          color="green"
        >
          <v-icon
            class="mr-4"
            size="x-large"
          >
            mdi-email
          </v-icon>
          email my boss
        </v-btn>
      </template>
    </DetailFrame>
    <div
      v-if="mappedDataSets.length > 0 && dataSets.length !== 0"
      style="padding: 15px"
    >
      <div v-for="(mappedData, index) in mappedDataSets" :key="index">
        <div style="overflow: auto;">
          <ChartRender :chartData="mappedData" />
        </div>
      </div>
    </div>
    <div
      v-else-if="mappedDataSets.length === 0 && dataSets.length !== 0"
      style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; padding-top: 50px;"
    >
      <!-- <img src="../assets/GraphLoading.gif" > -->
      <v-progress-circular
        indeterminate
        color="blue-darken-2"
        size="72"
        width="7"
      ></v-progress-circular>
    </div>
    <div
      v-else
      style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;"
    >
      <h1>
        {{ report.name }} Doesn't Contain Any Data Sets
      </h1>
      <p>
        Add Data Sets <a href="https://docs.google.com/spreadsheets/d/1pj3yveeKzqVRaIfLOyYB-t9ntEgkCFikkKE3Iu1NvA0/edit#gid=0">Here</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputCoupler from './InputCoupler.vue'
import DetailInput from './DetailInput.vue'
import DetailHeader from './DetailHeader.vue'
import DetailFrame from './DetailFrame.vue'
import ChartRender from './ChartRender.vue'
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

function requestHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access-token')}`,
    } as const
  }
}

const props = defineProps<{
  item: any
}>()

const sendEmail = async () => {
  await axios.post(`/api/send-email`, {
    to: 'thomas@eykamp.com',
    subject: 'Bitch Better Have My Graphs',
    html: `
      <h1>
        Give me my fucking data
      </h1>
    `
  })
}

const report = computed(() => props.item)
const dataSets = computed(() => {
  if (report.value.dataSets) {
    return report.value.dataSets.split(',').map((ds: string) => ds.trim())
  } else {
    return []
  }
})


const mappedDataSets = ref([])

onMounted(async () => {
  await getDataSets();
})

const getDataSets = async () => {
  for await (const range of dataSets.value) {
    const { data } = await (await axios.get(`/api/range/${range}`, requestHeaders()));
    const rowLength = data.map((d: any) => d.length)
    const maxLength = Math.max(...rowLength)
    const newData = data.map((d: any) => {
      if (d.length < maxLength) {
        const diff = maxLength - d.length
        const fill = Array(diff).fill('')
        return [...d, ...fill]
      } else {
        return d
      }
    })
    mappedDataSets.value.push(newData || [[]])
  }
}
</script>