<template>
  <div id="panel-parent">
    <v-sheet
      class="background-matte"
      color="blue-lighten-4"
    ></v-sheet>
    <v-main>
      <div
        :style="{
          position: 'relative',
          height: '100vh'
        }"
        class="d-flex flex-row"
      >
        <div
          ref="panelList"
          :style="{
            overflow: 'auto',
            minWidth: mdAndUp ? `${itemListWidth}px` : '',
            maxWidth: mdAndUp ? `${itemListWidth}px` : '',
          }"
          class="d-flex flex-grow-1 flex-column align-center"
        >
          <v-sheet
            color="blue-darken-2"
            style="width: 100%;"
          >
            <ProjectList />
          </v-sheet>
        </div>
        <v-sheet
          v-if="mdAndUp"
          @mousedown="resizeStart"
          :color="resizing ? 'blue-darken-4' : 'transparent'"
          :style="{
            width: '3px',
            height: '100%',
            cursor: 'col-resize',
            position: 'absolute',
            zIndex: 100,
            left: `${proposedWidth}px`,
          }"
        ></v-sheet>
        <ProjectDetail />
      </div>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed
} from 'vue'
import { useDisplay } from 'vuetify'

import ProjectList from '../components/ProjectList.vue'
import ProjectDetail from '../components/ProjectDetail.vue'

const { mdAndUp } = useDisplay()

const panelListCollapsed = ref(false)

const resizing = ref(false)
const panelListWidth = ref(480)
const proposedWidth = ref(panelListWidth.value)

const resizeStart = (e: MouseEvent) => {
  resizing.value = true
  const panelParent = document.getElementById('panel-parent')!
  panelParent.style.userSelect = 'none'
  proposedWidth.value = panelListWidth.value
  document.addEventListener('mousemove', resizeMove)
  document.addEventListener('mouseup', resizeEnd)
}

const resizeMove = (e: MouseEvent) => {

  const [smallestAllowed, largestAllowed] = [350, 550]

  if (!resizing.value) {
    return
  }

  const newWidth = e.clientX

  if (newWidth < smallestAllowed || newWidth > largestAllowed) {
    return
  }
  proposedWidth.value = newWidth
}

const resizeEnd = () => {
  resizing.value = false
  const panelParent = document.getElementById('panel-parent')
  if (!panelParent) {
    throw new Error('panel-parent not found')
  }
  panelParent.style.userSelect = 'auto'
  panelListWidth.value = proposedWidth.value
  document.removeEventListener('mousemove', resizeMove)
  document.removeEventListener('mouseup', resizeEnd)
}

const itemListWidth = computed(() => {
  if (panelListCollapsed.value) {
    return 1
  }
  return panelListWidth.value
})
</script>