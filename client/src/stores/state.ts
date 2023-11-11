import { defineStore } from 'pinia'

type Report = {
  name: string
  client: string
  date: string
  status: string
  desc: string
  sysId: number
}

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

    filter: '',

    syncStatus: true,

    user: null
  }),
  getters: {
    filteredReports(): any {
      return this.reports.filter((report) => report.name.toLowerCase().includes(this.filter.toLowerCase()))
    }
  },
  actions: {
    addReport() {
      const sysId = Math.floor(Math.random() * 100000)

      const report: Report = {
        name: `New Report`,
        client: `Client ${sysId}`,
        date: '2021-09-01',
        status: 'In Progress',
        desc: 'Lorem ipsum dolor sit amet, consectetur',
        sysId,
      }

      this.reports.unshift(report)
    },
    addReportCache(report: Report) {
      this.reports.unshift(report)
    },
    deleteReport(id: number) {
      this.reports = this.reports.filter((report) => report.sysId !== id)
      this.selectedReport = null
    },
    deleteReportCache(id: number) {
      this.reports = this.reports.filter((report) => report.sysId !== id)
    }
  }
})