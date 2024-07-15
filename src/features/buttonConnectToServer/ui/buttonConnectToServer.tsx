import styles from "./buttonConnectToServer.module.css"
import { useEffect, useRef, useState } from "react"
import { BiWifi, BiWifiOff } from "react-icons/bi"
import { CircularProgress } from "@mui/material"
import { ButtonMenuHead } from "../../../shared/buttons"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import {
  connectToServerFailure,
  connectToServerRequest,
  connectToServerSuccess,
  disconnectToServer,
  selectIsConnection,
  selectStateConnection,
} from "../model/serverConnectionSlice"

export const ButtonConnectToServer = () => {
  const dispatch = useAppDispatch()
  const isConnection = useAppSelector(selectIsConnection)
  const stateConnection = useAppSelector(selectStateConnection)
  const [status, setStatus] = useState<string>("Ожидание...")
  console.log(status)
  console.log(stateConnection)

  const ws_URL = "wss://ws.coincap.io/prices?assets=bitcoin,ethereum"
  const ws = useRef<WebSocket | null>(null)

  const openConnection = () => {
    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      return
    }
    ws.current = new WebSocket(ws_URL)
    dispatch(connectToServerRequest())
    setStatus("Подключение...")

    ws.current.onopen = () => {
      setStatus("Соединение открыто!")
      dispatch(connectToServerSuccess())
    }

    ws.current.onerror = error => {
      dispatch(connectToServerFailure("Ошибка подключения!"))
    }

    ws.current.onclose = () => {
      setStatus("Соединение закрыто!")
      dispatch(disconnectToServer())
    }

    ws.current.onmessage = e => {
      const message = JSON.parse(e.data)
      console.log(message)
    }
  }

  const closeConnection = () => {
    if (ws.current) {
      ws.current.close()
      dispatch(disconnectToServer())
    }
  }

  const handleToggleConnection = () => {
    if (isConnection) {
      closeConnection()
    } else {
      openConnection()
    }
  }

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close()
        ws.current = null
      }
    }
  }, [])

  return (
    <>
      <div className={styles.buttonContainer}>
        <ButtonMenuHead
          value="check"
          selected={isConnection}
          title="Подключение к серверу"
          onClick={handleToggleConnection}
          disabled={stateConnection === "connecting"}
        >
          {stateConnection === "connecting" ? (
            <CircularProgress size={24} style={{ color: "#04b355ff" }} />
          ) : isConnection ? (
            <BiWifi size="100%" style={{ color: "#04b355ff" }} />
          ) : (
            <BiWifiOff size="100%" style={{ color: "#fff" }} />
          )}
        </ButtonMenuHead>
      </div>
    </>
  )
}
