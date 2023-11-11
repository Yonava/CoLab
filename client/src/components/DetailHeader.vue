<template>
  <div>
    <div class="d-flex flex-row align-center">
      <SyncStatus />
    </div>
    <div
      class="d-flex flex-row align-center"
    >
      <DetailInput
        :item="item"
        :input="{ type: 'title' }"
        :prop="'name'"
        :placeholder="placeholder"
      />
    </div>
    <v-divider class="mt-2 mb-4"></v-divider>
  </div>
</template>

<script setup lang="ts">
import SyncStatus from "./SyncStatus.vue";
import DetailInput from "./DetailInput.vue";
import { computed } from "vue";

const props = defineProps<{
  item: any;
  placeholder?: string;
}>();

const placeholder = computed(() => {
  return props.placeholder ?? "";
});
</script>