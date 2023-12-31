import { defineStore } from 'pinia'
import { useSocket } from './socket'
import axios from 'axios'
import { mapReports, unmapReports } from '../Mapper'

let headerRow = []

type Report = {
  name: string
  client: string
  date: string
  status: string
  desc: string
  dataSets: string
  sysId: number
  managerEmail: string
  row: any
}

function requestHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access-token')}`,
    } as const
  }
}

export const useState = defineStore('state', {
  state: () => ({
    reports: [],
    selectedReport: null,

    filter: '',

    syncStatus: true,

    sortProp: null,

    user: null
  }),
  getters: {
    filteredReports(): any {
      if (this.sortProp) {
        return this.reports.filter((report) => report.name.toLowerCase().includes(this.filter.toLowerCase())).sort((a, b) => {
          if (a[this.sortProp] < b[this.sortProp]) {
            return -1
          }
          if (a[this.sortProp] > b[this.sortProp]) {
            return 1
          }
          return 0
        }) || []
      }
      return this.reports.filter((report) => report.name.toLowerCase().includes(this.filter.toLowerCase())) || []
    }
  },
  actions: {
    async addReport() {
      const sysId = Math.floor(Math.random() * 100000)

      const report: Report = {
        name: '',
        client: ``,
        date: '',
        status: 'In Progress',
        desc: '',
        dataSets: '',
        managerEmail: '',
        row: null,
        sysId,
      }

      const { data: res } = await axios.post(`/api/range/Reports`, unmapReports([report]), requestHeaders());
      report.row = res.row;

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

      try {
        const { data } = (await axios.get(`/api/range/Reports`, requestHeaders()));
        headerRow = data.shift()
        this.reports = mapReports(data)
      } catch (error) {
        console.log(error)
        window.location.replace(`/auth`)
        return
      }

      if (!this.user) {
        const { data } = await axios.get("/api/user", requestHeaders());
        this.user = data
      }
      console.log(this.user)
    },
    addReportCache(report: any) {
      this.reports.unshift(report)
    },
    async deleteReport(id: number) {
      useSocket().emitUserAction({
        action: 'delete',
        payload: {
          sysId: id
        }
      })
      const report = this.reports.find((report) => report.sysId === id)
      this.reports = this.reports.filter((report) => report.sysId !== id)
      await axios.delete(`/api/range/Reports/${report.row}`, requestHeaders());
      this.selectedReport = null
    },
    deleteReportCache(id: number) {
      this.reports = this.reports.filter((report) => report.sysId !== id)
    }
  }
})