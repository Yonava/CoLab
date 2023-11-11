import { defineStore } from "pinia";
import { mapReports, unmapReports } from "../Mapper";
import { useState } from "./state";
import axios from "axios";

const requestHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
  },
});

type UpdateItem = {
  // key is the sysId
  [key: string]: {
    originalRowItem: any[],
    item: any,
  }
}

type UpdateProperty = {
  item: any,
}

const cells: Record<number, string> = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J',
  10: 'K',
  11: 'L',
  12: 'M',
  13: 'N',
  14: 'O',
  15: 'P',
  16: 'Q',
  17: 'R',
  18: 'S',
  19: 'T',
  20: 'U',
  21: 'V',
  22: 'W',
  23: 'X',
  24: 'Y',
  25: 'Z',
} as const

export const useUpdateScheduler = defineStore('updateScheduler', {
  state: () => ({
    // a list of items that need to be updated
    updater: {} as UpdateItem,
    // a timeout that will execute the google sheets update
    timeout: null as null | ReturnType<typeof setTimeout>,
    // debounce time for the timeout
    debounceMs: 2000,
  }),
  getters: {},
  actions: {
    async manageTimeout() {
      // if the timeout is already set, clear it
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      // set a new timeout
      this.timeout = setTimeout(() => {
        this.executeGoogleSheetsUpdate()
      }, this.debounceMs)
    },
    trackItemForUpdate({ item }: UpdateProperty) {

      const { sysId } = item

      // indicate processing to the user
      useState().syncStatus = false

      // add item to updater if it is not already there
      if (!this.updater[sysId]) {
        this.updater[sysId] = {
          originalRowItem: unmapReports([item])[0],
          item,
        }
      }

      // clear the timeout and set a new one
      this.manageTimeout()
    },
    async executeGoogleSheetsUpdate() {
      // parse the updater object into a list of requests to send to the google sheets api

      const sysIds = Object.keys(this.updater) as string[]

      const data: any = []

      for (const sysId of sysIds) {
        const { item, originalRowItem } = this.updater[sysId] as {
          item: any,
          originalRowItem: any[],
        }

        const rowItem = unmapReports([item])[0]

        for (let i = 0; i < rowItem.length; i++) {
          if (rowItem[i] !== originalRowItem[i]) {

            if (i > 25) {
              throw new Error('Column index is greater than 25')
            }

            data.push({
              range: `Reports!${cells[i]}${item.row}`,
              values: [[rowItem[i]]]
            })
          }
        }
      }

      if (data.length > 0) {
        await axios.put("/api/batch", data, requestHeaders());
      }

      this.updater = {}
      useState().syncStatus = true
    },
  }
})