<template>
  <div
    class="d-flex align-center justify-center flex-column"
    :style="`position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: linear-gradient(rgb(38, ${gVal}, 15), rgb(0, 41, ${bVal}));`"
  >
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="blue-darken-2"
      size="64"
    ></v-progress-circular>
    <div class="width: 100%; border: 1px solid red">
      <div style="text-align: left;">
        <h1 style="font-size: 3em; color: white; line-height: 1">
          Welcome To
        </h1>
        <h1 v-if="!loading" style="font-size: 10em; color: white; line-height: 1">
          CoLab
        </h1>
      </div>

      <div style="display: flex; flex-direction: row-reverse; gap: 25px;">

        <v-btn
          @click="authorize()"
          size="120"
          color="blue-darken-2"
          icon
        >
          <v-icon size="80">mdi-facebook</v-icon>
        </v-btn>

        <v-btn
          @click="authorize()"
          size="120"
          color="green-darken-1"
          icon
        >
          <v-icon size="80">mdi-linkedin</v-icon>
        </v-btn>

        <v-btn
          @click="authorize()"
          size="120"
          color="blue-darken-2"
          icon
        >
          <v-icon size="80">mdi-google</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from '../stores/state';
import { onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useSocket } from '../stores/socket';

const loading = ref(false)
const router = useRouter()
const { user } = storeToRefs(useState());

const gVal = ref(0)
const bVal = ref(0)

const incrementMS = (ms: number, val: number, ref: Ref<number>) => {
  const valAddedPerMs = val / ms
  for (let i = 0; i < ms; i++) {
    setTimeout(() => {
      ref.value += valAddedPerMs
    }, i)
  }
}


incrementMS(2000, 255, gVal)
incrementMS(2000, 255, bVal)

setInterval(() => {
  let newGVal = Math.floor(Math.random() * 255)
  let newBVal = Math.floor(Math.random() * 255)

  incrementMS(2000, newGVal - gVal.value, gVal)
  incrementMS(2000, newBVal - bVal.value, bVal)
}, 2000)

const getURL = async () => {
  const response = await axios.get('/api/auth/url')
  if (!response.data.url) {
    throw new Error('No URL received')
  }
  const { url } = response.data
  return url
}

const authorize = async () => {
  const url = await getURL()
  window.location.replace(url)
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (!code) {
    return
  }

  loading.value = true

  let authUrl = `/api/auth/${encodeURIComponent(code)}`

  const { data } = await axios.get(authUrl) as {
    data: {
      accessToken: string,
      profile: any,
    }
  }
  const { error } = data as { error?: any }

  if (error) {
    location.replace(`/auth?error=${error}`)
    throw new Error(error)
  }

  user.value = data.profile
  localStorage.setItem('access-token', data.accessToken)

  const { connect, disconnect } = useSocket()

  disconnect()
  await connect()

  router.push('/')
})
</script>