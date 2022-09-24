import { Route, Routes } from 'react-router-dom'
import ChartsHome from './ChartsHome/ChartsHome'

const Charts = () => {
  return (
    <Routes>
      <Route path="/" element={<ChartsHome />} />
    </Routes>
  )
}

export default Charts
