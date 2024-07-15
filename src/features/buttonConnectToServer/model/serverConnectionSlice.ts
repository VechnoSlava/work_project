import { type PayloadAction } from "@reduxjs/toolkit/react"
import { createAppSlice } from "../../../app/store/createAppSlice"

export interface IConnectionState {
  isConnection: boolean
  stateConnection: "idle" | "connecting" | "success" | "failed"
  errorMessage: string | null
}

const initialState: IConnectionState = {
  isConnection: false,
  stateConnection: "idle",
  errorMessage: null,
}

export const serverConnectionSlice = createAppSlice({
  name: "serverConnection",
  initialState,
  reducers: create => ({
    connectToServerRequest: create.reducer(state => {
      state.stateConnection = "connecting"
      state.errorMessage = null
    }),
    connectToServerSuccess: create.reducer(state => {
      state.isConnection = true
      state.stateConnection = "success"
      state.errorMessage = null
    }),
    connectToServerFailure: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.isConnection = false
        state.stateConnection = "failed"
        state.errorMessage = action.payload
      },
    ),
    disconnectToServer: create.reducer(state => {
      state.isConnection = false
      state.stateConnection = "idle"
    }),
  }),
  selectors: {
    selectIsConnection: state => state.isConnection,
    selectStateConnection: state => state.stateConnection,
    selectErrorMessageConnection: state => state.errorMessage,
  },
})

export const {
  connectToServerRequest,
  connectToServerSuccess,
  connectToServerFailure,
  disconnectToServer,
} = serverConnectionSlice.actions
export const {
  selectIsConnection,
  selectStateConnection,
  selectErrorMessageConnection,
} = serverConnectionSlice.selectors
