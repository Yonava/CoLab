<template>
  <InputField
    v-bind="$attrs"
    :prop="prop"
    :item="item"
    :icon="icon"
    :input="input"
    :button="button"
    :inputVariant="config.inputVariant"
    :inputMedium="config.inputMedium"
    :width="width"
  />
</template>

<script setup lang="ts">
import InputField from './InputField.vue'

const config = {
  inputVariant: 'outlined',
  inputMedium: 'DETAIL'
} as const

const props = defineProps<{
  prop: string,
  item: any,
  icon?: string,
  width?: string,
  input?:
    {
      type: 'text',
      variant: 'string' | 'number',
    } |
    {
      type: 'autocomplete',
      items: string[],
    } |
    {
      type: 'select',
      items: string[] | readonly string[],
    } |
    {
      type: 'textarea',
    } |
    {
      type: 'title',
    } | {
      type: 'title-variant'
    }
  button?: {
    condition: boolean,
    newPropValue: () => string | number | boolean,
    text: string,
    disableCondition?: boolean,
  }
}>()
</script>