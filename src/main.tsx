import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import timemachine from "timemachine"
import App from "./app/App"
console.log(new Date())

timemachine.config({
  dateString: "2020 00:00:00",
  // timestamp: currentTimeStamp,
  // difference: -timeDifference,
  tick: true,
})

timemachine.reset()
console.log(new Date())

const container = document.getElementById("root")
const renderApp = (container: HTMLElement) => {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
if (container) {
  renderApp(container)
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
