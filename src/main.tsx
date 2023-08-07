import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>

      <BrowserRouter>
        <App />
      </BrowserRouter>
     
    </ChakraProvider>
  </React.StrictMode>,
)
