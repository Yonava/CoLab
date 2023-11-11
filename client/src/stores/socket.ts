import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { useState } from "./state";
import { useRouter } from "vue-router";

export const useSocket = defineStore("socket", {
  state: () => ({
    socket: null as any,
  }),
  actions: {
    async connect() {
      if (this.socket?.connected) {
        console.log('Socket already connected')
        return
      }

      const accessToken = localStorage.getItem('access-token');
      if (!accessToken) {
        console.log('No access token found')
        return
      }

      this.disconnect();
      const router = useRouter();

      const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/'
      this.socket = io(socketUrl);

      await new Promise((resolve, reject) => {
        this.socket.on('connect', () => {
          resolve('SOCKET_CONNECTED')
        })

        this.socket.on('connect_error', (error: any) => {
          console.error('Socket connection error', error)
          router.push('/auth/error=SOCKET_EXCEPTION')
          reject(error)
        })
      })

      this.initiateSocketListeners()
    },
    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
      }
    },
    emitUserAction(action: any) {
      console.log(this.socket)
      this.socket.emit('userAction', {
        ...action,
        googleId: useState().user?.id
      })
    },
    initiateSocketListeners() {
      const listeners = [
        {
          name: 'userAction',
          action: (userAction: any) => {
            switch (userAction.action) {
              case 'add':
                const { addReportCache } = useState()
                addReportCache(userAction.payload.item)
                break

              case 'delete':

                const { deleteReportCache } = useState()
                deleteReportCache(userAction.payload.sysId)
                break

              case 'prop-update':

                const { reports } = useState()
                const item = reports.find((report) => report.sysId === userAction.payload.sysId)
                if (!item) {
                  console.error('useAuth: (prop-update) item not found')
                  return
                }
                item[userAction.payload.prop] = userAction.payload.value
                break
            }
          }
        }
      ]

      listeners.forEach(listener => {
        this.socket.on(listener.name, listener.action)
      })
    },
  }
});