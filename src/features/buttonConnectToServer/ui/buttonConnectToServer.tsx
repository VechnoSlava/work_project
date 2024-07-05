import { BiWifi, BiWifiOff } from "react-icons/bi"
import { ButtonMenuHead } from "../../../shared/buttons"
import styles from "./buttonConnectToServer.module.css"
import { useEffect, useRef, useState } from "react"

export const ButtonConnectToServer = () => {
  const ws_URL = "wss://ws.coincap.io/prices?assets=bitcoin,ethereum"
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [status, setStatus] = useState<string>("Соединение закрыто")
  const ws = useRef<WebSocket | null>(null)

  const openConnection = () => {
    ws.current = new WebSocket(ws_URL)
    ws.current.onopen = () => setStatus("Соединение открыто")
    ws.current.onclose = () => setStatus("Соединение закрыто")
    ws.current.onmessage = e => {
      const message = JSON.parse(e.data)
      console.log(message)
    }
  }

  const closeConnection = () => {
    if (ws.current) {
      ws.current.onclose = () => {
        setStatus("Соединение закрыто")
        ws.current = null
      }
      ws.current.close()
    }
  }

  const toggleConnection = () => {
    if (isConnected) {
      closeConnection()
    } else {
      openConnection()
    }
    setIsConnected(!isConnected)
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
          selected={!isConnected}
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
      <div>{status}</div>
    </>
  )
}
