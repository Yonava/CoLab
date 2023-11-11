<template>
  <ReportDetail
    :item="selectedReport"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useState } from '../stores/state'
import ReportDetail from '../components/ReportDetail.vue'

const { selectedReport } = storeToRefs(useState())
</script>