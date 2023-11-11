<template>
  <div
    :style="{
      width: width ?? '100%',
    }"
  >

    <!-- optional button -->
    <ButtonInput
      v-if="button && button.condition"
      @click="buttonClicked"
      :inputMedium="inputMedium"
      :disableCondition="button.disableCondition"
    >
      {{ button.text }}
    </ButtonInput>

    <div v-if="activeInput.type === 'text'">

      <!-- text input -->
      <v-text-field
        v-if="activeInput.variant === 'string'"
        v-model="content"
        v-bind="$attrs"
        @input="input"
        :prepend-inner-icon="activeIcon"
        :variant="inputVariant"
        type="text"
      ></v-text-field>

      <!-- number input -->
      <v-text-field
        v-else-if="activeInput.variant === 'number'"
        v-model.number="content"
        v-bind="$attrs"
        @input="input"
        :prepend-inner-icon="activeIcon"
        :variant="inputVariant"
        type="number"
      ></v-text-field>

    </div>

    <v-autocomplete
      v-else-if="activeInput.type === 'autocomplete'"
      v-model="content"
      v-bind="$attrs"
      @update:model-value="input"
      :items="activeInput.items"
      :prepend-inner-icon="activeIcon"
      :variant="inputVariant"
    ></v-autocomplete>

    <v-select
      v-else-if="activeInput.type === 'select'"
      v-model="content"
      v-bind="$attrs"
      @update:model-value="input"
      :items="activeInput.items"
      :prepend-inner-icon="activeIcon"
      :variant="inputVariant"
    ></v-select>

    <v-textarea
      v-else-if="activeInput.type === 'textarea'"
      v-model="content"
      v-bind="$attrs"
      @input="input"
      prepend-inner-icon="mdi-note"
      auto-grow
      :variant="inputVariant"
    ></v-textarea>

    <input
      v-else-if="activeInput.type === 'title'"
      v-model="content"
      v-bind="$attrs"
      @input="input"
      type="text"
      class="title"
    />

    <input
      v-else-if="activeInput.type === 'title-variant'"
      v-model="content"
      v-bind="$attrs"
      @input="input"
      type="text"
      class="title-variant mt-2"
    />

  </div>
</template>

<script setup lang="ts">
import ButtonInput from './ButtonInput.vue'
import { computed } from 'vue'
import { useSocket } from '../stores/socket';
import { useUpdateScheduler } from '../stores/update'

const { emitUserAction } = useSocket()
const { trackItemForUpdate } = useUpdateScheduler()

type VuetifyInputVariant =
  'outlined' |
  'underlined' |
  'solo' |
  'filled' |
  'plain' |
  undefined

const props = defineProps<{
  prop: string,
  item: any,
  inputMedium: 'DETAIL' | 'EMBEDDED',
  inputVariant?: VuetifyInputVariant,
  width?: string,
  icon?: string,
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
    } |
    {
      type: 'title-variant'
    }
  button?: {
    condition: boolean,
    newPropValue: () => string | number | boolean,
    text: string,
    disableCondition?: boolean,
  },
}>()

const input = () => {
  emitUserAction({
    action: 'prop-update',
    payload: {
      prop: props.prop,
      value: props.item[props.prop],
      sysId: props.item.sysId
    }
  })
}

const buttonClicked = () => {
  if (!props.item) {
    return
  }

  trackItemForUpdate({
    item: props.item,
  })

  // @ts-ignore
  props.item[props.prop] = props.button?.newPropValue()
  emitUserAction({
    action: 'prop-update',
    payload: {
      prop: props.prop,
      value: props.item[props.prop],
      sysId: props.item.sysId
    }
  })
}

const activeInput = computed(() => {
  const type = props.input ?? {
    type: 'text',
    variant: 'string'
  }
  return type
})

const activeIcon = computed(() => {
  const iconProp = props.icon ?? undefined
  return iconProp ? `mdi-${iconProp}` : undefined
})

const content = computed({
  get: () => {
    if (!props.item) {
      return ""
    }
    // @ts-ignore
    return props.item[props.prop]
  },
  set: (v: string) => {

    if (!props.item) {
      return
    }

    trackItemForUpdate({
      item: props.item,
    })

    // @ts-ignore
    props.item[props.prop] = v
  }
})
</script>

<style scoped>
input.title {
  font-weight: 900;
  font-size: 3em;
  line-height: 0.9;
  width: 100%;
}

input.title:focus {
  outline: none;
}

input.title-variant {
  font-weight: 900;
  border: none;
  outline: none;
  width: 100%;
  font-size: 3rem;
}
</style>