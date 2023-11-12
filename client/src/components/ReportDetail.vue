<template>
  <div>
    <DetailFrame :item="report">
      <template #main>
        <DetailHeader
          :item="report"
          placeholder="Report Name"
        ></DetailHeader>

        <DetailInput
          :item="report"
          prop="managerEmail"
          label="Manager Email"
          icon="email"
        />

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
            :button="{
              condition: !report.date,
              newPropValue: () => new Date().toISOString().slice(0, 10),
              text: 'Today',
            }"
          />

          <DetailInput
            :item="report"
            prop="status"
            icon="check-circle"
            label="Status"
            :button="{
              condition: report.status === 'Pending Approval',
              newPropValue: () => 'Complete',
              text: 'Approve Report',
            }"
          />

        </InputCoupler>

      </template>
      <template #buttons>
        <v-btn v-if="report.status !== 'Complete'" @click="sendEmail" size="large" color="green" type="submit">
          <v-icon class="mr-4" size="x-large">
            mdi-email
          </v-icon>
          email my boss
        </v-btn>
      </template>
    </DetailFrame>
    <div
      v-if="mappedDataSets.length > 0 && dataSets.length !== 0"
      style="padding: 15px;"
    >
      <div v-for="(mappedData, index) in mappedDataSets" :key="index">
        <div class="mb-10">
          <ChartRender :chartData="mappedData" />
        </div>
      </div>
    </div>
    <div
      v-else-if="mappedDataSets.length === 0 && dataSets.length !== 0"
      style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; padding-top: 50px;"
    >
      <v-progress-circular
        indeterminate
        color="blue-darken-2"
        size="72"
        width="7"
      ></v-progress-circular>
    </div>
    <div
      v-else
      style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;"
    >
      <h1>
        {{ report.name }} Doesn't Contain Any Data Sets
      </h1>
      <p>
        Add Data Sets <a href="https://docs.google.com/spreadsheets/d/1pj3yveeKzqVRaIfLOyYB-t9ntEgkCFikkKE3Iu1NvA0/edit#gid=0">Here</a>
      </p>
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
    console.log('successfully sent email')
    report.value.status = 'Pending Approval'


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
  for await (const range of dataSets.value) {
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