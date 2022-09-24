import { Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import Charts from './Charts/Charts'

const Core = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="charts/*" element={<Charts />} />
    </Routes>
  )
}

export default Core
