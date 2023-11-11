<template>
  <v-sheet
    class="d-flex align-center justify-center flex-column"
    height="100%"
  >
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="blue-darken-2"
      size="64"
    ></v-progress-circular>
    <h1 v-if="!loading" style="font-size: 250%">
      Welcome To CoLab
    </h1>
    <v-sheet
      v-if="!loading"
      class="d-flex align-center justify-center flex-column"
    >
      <div class="mb-8 d-flex flex-row align-center">
        <div style="max-width: 450px; text-align: center;">
          <h1 style="font-size: 150%;">
            Please Authorize
          </h1>
        </div>
      </div>
      <v-btn
        @click="authorize()"
        color="red-darken-2"
        elevation="3"
        class="mb-12"
        size="x-large"
      >
        <v-icon class="mr-2">mdi-google</v-icon>
        Continue With Google
      </v-btn>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import { useState } from '../stores/state';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useSocket } from '../stores/socket';

const loading = ref(false)
const router = useRouter()
const { user } = storeToRefs(useState());

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