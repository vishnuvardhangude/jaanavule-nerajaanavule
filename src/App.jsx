import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Game from './components/Game'
import Footer from './components/Footer'
import styled from 'styled-components'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <Header />
      <Game />
      {/* <Footer /> */}
      <Analytics />
      <SpeedInsights />
    </div>
  )
}

export default App

