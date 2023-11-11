<template>
  <div>
    <DetailFrame :item="report">
      <template #main>
        <DetailHeader
          :item="report"
          placeholder="Course Code"
        ></DetailHeader>

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
    </DetailFrame>
    <div style="height: 700px; overflow: auto; padding: 15px">
      <div v-for="(mappedData, index) in mappedDataSets" :key="index">
        <div style="overflow: auto;">
          <ChartRender :chartData="mappedData" />
        </div>
      </div>
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
  for (const range of dataSets.value) {
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