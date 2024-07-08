// import { type PayloadAction } from "@reduxjs/toolkit/react"
import { createAppSlice } from "../../../app/store/createAppSlice"

export interface IConnectionState {
  isConnected: boolean
  stateConnection: "idle" | "connecting" | "success" | "failed"
}

const initialState: IConnectionState = {
  isConnected: false,
  stateConnection: "idle",
}

export const serverConnectionSlice = createAppSlice({
  name: "serverConnection",
  initialState,
  reducers: create => ({
    connectToServer: create.reducer(state => {
      state.isConnected = true
    }),
    disconnectToServer: create.reducer(state => {
      state.isConnected = false
    }),
  }),
  selectors: {
    selectIsConnected: state => state.isConnected,
  },
})

export const { connectToServer, disconnectToServer } =
  serverConnectionSlice.actions
export const { selectIsConnected } = serverConnectionSlice.selectors
