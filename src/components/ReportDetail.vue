<template>
  <div>
    report detail {{ item }}
    <v-btn>hi</v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: any
}>()
</script>