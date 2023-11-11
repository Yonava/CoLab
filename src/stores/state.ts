import { defineStore } from 'pinia'

export const useState = defineStore('state', {
  state: () => ({
    reports: [
      ...Array.from({ length: 100 }, (_, i) => ({
        name: `Report ${i + 2}`,
        client: `Client ${i + 2}`,
        date: '2021-09-01',
        status: 'In Progress',
        desc: 'Lorem ipsum dolor sit amet, consectetur',
        sysId: i + 2,
      }))
    ],
    selectedReport: null,

    syncStatus: true,
  }),
  getters: {

  },
  actions: {

  }
})