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

    </template>
  </DetailFrame>
</template>

<script setup lang="ts">
import InputCoupler from './InputCoupler.vue'
import DetailInput from './DetailInput.vue'
import DetailHeader from './DetailHeader.vue'
import DetailFrame from './DetailFrame.vue'
import { computed } from 'vue'

const props = defineProps<{
  item: any
}>()

const report = computed(() => props.item)
</script>