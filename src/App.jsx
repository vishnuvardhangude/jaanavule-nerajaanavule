import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Game from './components/Game'
import Footer from './components/Footer'
import styled from 'styled-components'
import ImageCover from './components/ImageCover'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <Header />
      <Game />
      {/* <ImageCover/> */}
      {/* <Test/> */}
      <Footer />
    </div>
  )
}

export default App

