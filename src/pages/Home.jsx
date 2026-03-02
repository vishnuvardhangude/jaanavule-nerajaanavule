import React, { useState, useEffect } from 'react'
import '../App.css'
import Game from '../components/Game'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import styled from 'styled-components'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ROWS, COLS } from '../utils/constants';
import { useLocalStorage, useLocalStorageSet } from '../utils/storage';


const Home = ({names}) => {


  const [imageUrl, setImageUrl] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [guessDistribution, setGuessDistribution] = useLocalStorage("guessDistribution", []);
  const [formattedDate, setFormattedDate] = useLocalStorage("formattedDate", "01/01/2026");
  const [gameNumber, setGameNumber] = useState("");

  const initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0
  };

  const [stats, setStats] = useLocalStorage("stats", JSON.stringify(initialStats));
  const statsObj = React.useMemo(() => {
    return typeof stats === "string" ? JSON.parse(stats) : stats;
  }, [stats]);


  useEffect(() => {


    // console.log("start", new Date())
    // const fetchGameData = async () => {
    //   try {
    //     const gameDataUrl = import.meta.env.VITE_GAME_DATA_URL;
    //     const namesDataUrl = import.meta.env.VITE_NAMES_DATA_URL;

    //     if (!gameDataUrl || !namesDataUrl) {
    //       console.error("Env variables not set");
    //       return;
    //     }

    //     // ✅ Fetch both at same time
    //     const [res1, res2] = await Promise.all([
    //       fetch(gameDataUrl),
    //       fetch(namesDataUrl)
    //     ]);

    //     const [data, namesData] = await Promise.all([
    //       res1.json(),
    //       res2.json()
    //     ]);

    //     const formatted = namesData.map(item => item.Celebrities);

    //     // console.log(formatted);
    //     setNames(formatted);

    //     // Get today's date in DD/MM/YYYY format

    //     const today = new Date();
    //     const formattDate = `${String(today.getDate()).padStart(2, "0")}/${String(
    //       today.getMonth() + 1
    //     ).padStart(2, "0")}/${today.getFullYear()}`;

    //     const todayRow = data.find(row => row.Date === formattDate);

    //     setFormattedDate(formattDate);

    //     if (todayRow) {
    //       const driveLink = todayRow.Image;
    //       // console.log("Drive Link from sheet:", driveLink);

    //       // Extract Google Drive file ID from common formats
    //       let fileId =
    //         driveLink.match(/id=([^&]+)/)?.[1] ||  // ?id=FILEID
    //         driveLink.match(/\/d\/([^\/]+)/)?.[1]; // /d/FILEID/

    //       // console.log("Extracted File ID:", fileId);

    //       if (fileId) {

    //         const finalUrl = fileId
    //           ? `https://lh3.googleusercontent.com/d/${fileId}`
    //           : "";

    //         setImageUrl(finalUrl);
    //         // console.log("Final Image URL:", finalUrl);
    //       } else {
    //         console.warn("Could not extract Drive ID from:", driveLink);
    //       }
    //       // console.log(todayRow.Answer)
    //       setCorrectAnswer(todayRow.Answer);
    //     } else {
    //       console.log("No game data for today:", formattDate);
    //     }
    //   } catch (error) {
    //     console.error("Error loading data:", error);
    //   }
    // };

    const fetchGameData = async () => {
      try {
        const gameDataUrl = import.meta.env.VITE_GAME_DATA_URL;

        if (!gameDataUrl) {
          console.error("Env variables not set");
          return;
        }

        // ✅ Fetch both at same time
        const [res1] = await Promise.all([
          fetch(gameDataUrl),
        ]);

        const [data] = await Promise.all([
          res1.json()
        ]);


        // Get today's date in DD/MM/YYYY format

        const today = new Date();
        const formattDate = `${String(today.getDate()).padStart(2, "0")}/${String(
          today.getMonth() + 1
        ).padStart(2, "0")}/${today.getFullYear()}`;

        const todayRow = data.find(row => row.Date === formattDate);

        setFormattedDate(formattDate);

        if (todayRow) {
          const driveLink = todayRow.Image;
          // console.log("Drive Link from sheet:", driveLink);

          // Extract Google Drive file ID from common formats
          let fileId =
            driveLink.match(/id=([^&]+)/)?.[1] ||  // ?id=FILEID
            driveLink.match(/\/d\/([^\/]+)/)?.[1]; // /d/FILEID/

          // console.log("Extracted File ID:", fileId);

          if (fileId) {

            const finalUrl = fileId
              ? `https://lh3.googleusercontent.com/d/${fileId}`
              : "";

            setImageUrl(finalUrl);
            // console.log("Final Image URL:", finalUrl);
          } else {
            console.warn("Could not extract Drive ID from:", driveLink);
          }
          // console.log(todayRow.Answer)
          setCorrectAnswer(todayRow.Answer);

          setGameNumber(todayRow.GameNumber);

        } else {
          console.log("No game data for today:", formattDate);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchGameData();
    // console.log("end", new Date())
    // console.log("gamewon ", gameWon);
    // console.log("gameLost ", gameLost)

  }, []);

  return (
    <div className='app'>

        {/* {console.log("frmat", formattedDate)} */}
      <Menu 
        stats={stats}
        setStats={setStats}
        statsObj={statsObj}
        guessDistribution={guessDistribution}
        setGuessDistribution={setGuessDistribution}
      />

      <Game
        imageUrl={imageUrl}
        names={names}
        correctAnswer={correctAnswer}
        stats={stats}
        setStats={setStats}
        statsObj={statsObj}
        guessDistribution={guessDistribution}
        setGuessDistribution={setGuessDistribution}
        formattedDate={formattedDate}
        setFormattedDate={setFormattedDate}
        gameNumber={gameNumber}
        mode="daily"
      />
    
    </div>
  )
}

export default Home

