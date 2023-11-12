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

    user: null
  }),
  getters: {
    filteredReports(): any {
      return this.reports.filter((report) => report.name.toLowerCase().includes(this.filter.toLowerCase())) || []
    }
  },
  actions: {
    async addReport() {
      const sysId = Math.floor(Math.random() * 100000)

      const report: Report = {
        name: `New Report`,
        client: `Client ${sysId}`,
        date: '2021-09-01',
        status: 'In Progress',
        desc: 'Lorem ipsum dolor sit amet, consectetur',
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