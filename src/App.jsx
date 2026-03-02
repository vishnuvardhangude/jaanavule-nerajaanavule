import React, { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Game from './components/Game'
import Footer from './components/Footer'
import Menu from './components/Menu'
import styled from 'styled-components'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ROWS, COLS } from './utils/constants';
import { useLocalStorage, useLocalStorageSet } from './utils/storage';
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import TimeTravel from './pages/TimeTravel'


function App() {

  const [names, setNames] = useState(null);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const namesDataUrl = import.meta.env.VITE_NAMES_DATA_URL;

        if (!namesDataUrl) {
          console.error("Env variables not set");
          return;
        }

        // ✅ Fetch both at same time
        const [res1] = await Promise.all([
          fetch(namesDataUrl)
        ]);

        const [namesData] = await Promise.all([
          res1.json(),
        ]);

        const formatted = namesData.map(item => item.Celebrities);

        // console.log(formatted);
        setNames(formatted);

      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchNames();

  }, []);

  return (
    <div className='app'>
      <Header />
      <Routes>
        <Route path="/" element={<Home names={names}/>} />
        <Route path="/timetravel" element={<TimeTravel names={names}/>} />
        {/* < Home /> */}

      </Routes>
      {/* <Footer /> */}
      <Analytics />
      <SpeedInsights />
    </div>
  )
}

export default App

