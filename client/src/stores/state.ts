import { defineStore } from 'pinia'
import { useSocket } from './socket'

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
    reports: [],
    selectedReport: null,

    filter: '',

    syncStatus: true,

    user: null
  }),
  getters: {
    filteredReports(): any {
      return this.reports.filter((report) => report.name.toLowerCase().includes(this.filter.toLowerCase())) || []
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

      useSocket().emitUserAction({
        action: 'add',
        payload: {
          item: report
        }
      })

      this.reports.unshift(report)
      this.selectedReport = report
    },
    async getReports() {

      this.reports = [
        ...Array.from({ length: 100 }, (_, i) => ({
          name: `Report ${i + 2}`,
          client: `Client ${i + 2}`,
          date: '2021-09-01',
          status: 'In Progress',
          desc: 'Lorem ipsum dolor sit amet, consectetur',
          sysId: i + 2,
        }))
      ]

    },
    addReportCache(report: any) {
      console.log(report)
      this.reports.unshift(report)
    },
    deleteReport(id: number) {
      useSocket().emitUserAction({
        action: 'delete',
        payload: {
          sysId: id
        }
      })
      this.reports = this.reports.filter((report) => report.sysId !== id)
      this.selectedReport = null
    },
    deleteReportCache(id: number) {
      this.reports = this.reports.filter((report) => report.sysId !== id)
    }
  }
})