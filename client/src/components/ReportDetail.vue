<template>
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

      {{ dataSets }}

      <div v-for="(mappedData, index) in mappedDataSets" :key="index">
        <h1>
          Data Set: {{ index + 1 }} is
        </h1>
        <div>
          {{ mappedData  }}
        </div>
      </div>

    </template>
  </DetailFrame>
</template>

<script setup lang="ts">
import InputCoupler from './InputCoupler.vue'
import DetailInput from './DetailInput.vue'
import DetailHeader from './DetailHeader.vue'
import DetailFrame from './DetailFrame.vue'
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
    mappedDataSets.value.push(data || [[]])
  }
}
</script>