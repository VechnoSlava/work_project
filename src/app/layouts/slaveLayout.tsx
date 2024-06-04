import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { SlaveMainPage } from "../../pages/slaveMainPage"
import { SlaveHistoryPage } from "../../pages/slaveHistoryPage"

export const SlaveLayout: React.FC = () => {
  const [path, setPath] = useState<string>("")
  const location = useLocation()

  useEffect(() => {
    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  useEffect(() => {
    const newPath = location.state?.path
    if (newPath) {
      setPath(newPath)
    }
  }, [location.state])

  const handleMessage = (event: MessageEvent) => {
    const newPath = event.data.path
    setPath(newPath)
  }

  return (
    <div>
      {path === "/slaveMain" && <SlaveMainPage />}
      {path === "/slaveHistory" && <SlaveHistoryPage />}
    </div>
  )
}
