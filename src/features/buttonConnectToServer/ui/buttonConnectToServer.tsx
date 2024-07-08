import styles from "./buttonConnectToServer.module.css"
import { useEffect, useRef, useState } from "react"
import { BiWifi, BiWifiOff } from "react-icons/bi"
import { ButtonMenuHead } from "../../../shared/buttons"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import {
  connectToServer,
  disconnectToServer,
  selectIsConnected,
} from "../model/serverConnectionSlice"

export const ButtonConnectToServer = () => {
  console.log("ButtonConnectToServer!")

  const dispatch = useAppDispatch()
  const isConnected = useAppSelector(selectIsConnected)
  const [status, setStatus] = useState<string>("Соединение закрыто")

  const ws_URL = "wss://ws.coincap.io/prices?assets=bitcoin,ethereum"
  const ws = useRef<WebSocket | null>(null)

  const openConnection = () => {
    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      return
    }

    ws.current = new WebSocket(ws_URL)
    ws.current.onopen = () => {
      setStatus("Соединение открыто")
      dispatch(connectToServer())
    }
    ws.current.onclose = () => {
      setStatus("Соединение закрыто")
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
    }
  }

  const toggleConnection = () => {
    if (isConnected) {
      closeConnection()
    } else {
      openConnection()
    }
  }

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])
  console.log(status)

  return (
    <>
      <div className={styles.buttonContainer}>
        <ButtonMenuHead
          value="check"
          selected={isConnected}
          title="Подключение к серверу"
          onClick={toggleConnection}
        >
          {isConnected ? (
            <BiWifi size="100%" style={{ color: "#04b355ff" }} />
          ) : (
            <BiWifiOff size="100%" style={{ color: "#fff" }} />
          )}
        </ButtonMenuHead>
      </div>
    </>
  )
}
