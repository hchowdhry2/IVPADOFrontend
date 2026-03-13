
import './App.css'
import Navbar from './components/burnupChart/Navbar'
import DevOpsProvider from './context/DevOpsProvider'
import SpillageProvider from './context/SpillageProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <SpillageProvider>
        <DevOpsProvider>
          <Navbar/>
          <AppRoutes />
        </DevOpsProvider>
      </SpillageProvider>
    </>
  )
}

export default App
