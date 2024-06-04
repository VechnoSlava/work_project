import { Providers } from "./providers"
import { MainRouter } from "./routes/mainRouter"

function App() {
  return (
    <Providers>
      <MainRouter />
    </Providers>
  )
}

export default App
