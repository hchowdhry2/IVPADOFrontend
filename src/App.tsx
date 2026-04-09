
import './App.css'
import DevOpsProvider from './context/DevOpsProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <DevOpsProvider>
          <AppRoutes />
      </DevOpsProvider>
    </>
  )
}

export default App
