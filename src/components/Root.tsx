import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Core from '../components/core/Core'

const Root = () => {
  const theme = createTheme()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Core />} />
          </Routes>
        </BrowserRouter>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default Root
