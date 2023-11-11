<template>
  <v-btn
    color="blue-darken-1"
    :disabled="disabled"
    size="x-small"
    class="mb-3"
  >
    <slot><!-- optional fallback --></slot>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  inputMedium?: 'DETAIL' | 'EMBEDDED',
  disableCondition?: boolean,
}>()

const disabled = computed(() => {
  return props.disableCondition
})
</script>