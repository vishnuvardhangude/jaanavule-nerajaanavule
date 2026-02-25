import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Game from './components/Game'
import Footer from './components/Footer'
import styled from 'styled-components'
import ImageCover from './components/ImageCover'
import ImageFromDrive from './components/ImageFromDrive'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <Header />
      <Game />
      {/* <ImageCover/> */}
      {/* <ImageFromDrive /> */}
      {/* <Footer /> */}
    </div>
  )
}

export default App

