import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Game from './components/Game'
import Footer from './components/Footer'
import styled from 'styled-components'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <Header />
      <Game />
      {/* <Footer /> */}
    </div>
  )
}

export default App

