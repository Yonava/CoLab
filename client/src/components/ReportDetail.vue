<template>
  <div>
    <DetailFrame :item="report">
      <template #main>

        <DetailHeader :item="report" placeholder="Course Code"></DetailHeader>

        <DetailInput @submit.prevent="sendEmail" :item="report" prop="managerEmail" label="Manager Email" icon="email" />

        <DetailInput :item="report" prop="client" label="Client" icon="account" />

        <InputCoupler>

          <DetailInput :item="report" prop="date" icon="calendar-month" label="Date" />

          <DetailInput :item="report" prop="status" icon="check-circle" label="Status" />

        </InputCoupler>

      </template>
      <template #buttons>
        <v-btn @click="sendEmail" size="large" color="green" type="submit">
          <v-icon class="mr-4" size="x-large">
            mdi-email
          </v-icon>
          email my boss
        </v-btn>
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
import emailjs from 'emailjs-com'
import { computed, onMounted, ref } from 'vue'
import { useState } from '../stores/state'
import axios from 'axios'

function requestHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access-token')}`,
    } as const
  }
}

const { user } = useState()

const props = defineProps<{
  item: any
}>()

const report = computed(() => props.item)

const sendEmail = async () => {
  try {
    // Create a new HTMLFormElement
    const formElement = document.createElement('form')

    // Create form controls and add them to the form element
    const nameInput = document.createElement('input')
    nameInput.name = 'name'
    nameInput.value = user.name
    formElement.appendChild(nameInput);

    const reportInput = document.createElement('input')
    reportInput.name = 'report'
    reportInput.value = report.value.name
    formElement.appendChild(reportInput);

    const emailInput = document.createElement('input')
    emailInput.name = 'toEmail'
    emailInput.value = report.value.managerEmail
    formElement.appendChild(emailInput);

    const messageInput = document.createElement('input')
    messageInput.name = 'link'
    messageInput.value = `${window.location.href}?report=${report.value.sysId}`
    formElement.appendChild(messageInput)

    await emailjs.sendForm(
      'service_usqd07q',
      'template_oe59uhv',
      formElement,
      'V-BWoXu67Cs6ht84n'
    )
    console.log('success')


  } catch (error) {
    console.log({ error })
  }
}

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