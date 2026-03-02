import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // import styles
import styled from 'styled-components';
import { BsCalendarDate } from "react-icons/bs";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import Game from '../components/Game';
import { useLocalStorage } from '../utils/storage';


const TimeTravel = ({
  names
}) => {

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date(new Date().setDate(new Date().getDate() - 1))); // new state for calendar
  const [imageUrl, setImageUrl] = useState();
  const [correctAnswer, setCorrectAnswer] = useState();
  const [formattedDate, setFormattedDate] = useState("");
  const [gameNo, setGameNo] = useState();

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <CalendarButton onClick={onClick} ref={ref}>
      <BsCalendarDate style={{ alignItems: "right" }} />
      {value || "Select Date"}
    </CalendarButton>
  ));

  useEffect(() => {
    console.log("useEffect Timetravel.jsx")

    // console.log("start", new Date())
    const fetchGameData = async () => {
      try {
        const gameDataUrl = import.meta.env.VITE_GAME_DATA_URL;
        // const namesDataUrl = import.meta.env.VITE_NAMES_DATA_URL;

        if (!gameDataUrl) {
          console.error("Env variables not set");
          return;
        }

        // ✅ Fetch both at same time
        const [res1] = await Promise.all([
          fetch(gameDataUrl)
        ]);

        const [data] = await Promise.all([
          res1.json()
        ]);


        // Get today's date in DD/MM/YYYY format

        // const today = new Date();
        const formatDate = `${String(selectedDate.getDate()).padStart(2, "0")}/${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}/${selectedDate.getFullYear()}`;

        const todayRow = data.find(row => row.Date === formatDate);

        setFormattedDate(formatDate);

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

          setGameNo(todayRow.GameNumber)

        } else {
          console.log("No game data for today:", formatDate);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchGameData();

  }, [selectedDate]);

  return (

    <div>
      <Wrap>
        <BackButton onClick={() => navigate("/")}>
          ← Back
        </BackButton>
        <GameNumber>
          Game No.: #{gameNo}
        </GameNumber>
        <CalendarWrapper>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
            minDate={new Date(2026, 1, 24)} // Jan 1, 2026
            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))} // yesterday
            customInput={<CustomDateInput />}
          />
        </CalendarWrapper>
      </Wrap>
      <Game
        key={formattedDate}
        imageUrl={imageUrl}
        names={names}
        correctAnswer={correctAnswer}
        stats={null}
        setStats={null}
        statsObj={null}
        guessDistribution={null}
        setGuessDistribution={null}
        formattedDate={formattedDate}
        setFormattedDate={setFormattedDate}
        gameNumber={gameNo}
        mode="timetravel"
      />

    </div>
  )
}

export default TimeTravel

const Wrap = styled.div`
  display: flex;
  flex-directon: row;
  justify-content: space-between;
  align-items: center;
  max-width: 350px;
  margin: 0 auto;
`
/* Styled Component for calendar */
// const CalendarWrapper = styled.div`
//   margin-bottom: 16px;
//   width: 100%;
//   input {
//      width: 100%;            /* 👈 makes it full width */
//     padding: 10px 14px;     /* slightly bigger */
//     // padding: 8px 12px;
//     border-radius: 6px;
//     border: 1px solid #ccc;
//     font-family: 'Inter', sans-serif;
//     font-size: 14px;
//     cursor: pointer;
//   }
// `;

const CalendarWrapper = styled.div`
  margin-bottom: 16px;
  width: 100%;
  max-width: 150px;
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    font-size: 16px;
    box-sizing: border-box;
  }
`;

const BackButton = styled.button`
  // position: relative;
  top: 12px;
  left: 12px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #333;
  align-items: center;
  &:hover {
    color: #000;
  }
`;

const GameNumber = styled.div`
    
`
const CalendarButton = styled.button`
  display: flex;
  // align-items: center;
  justify-content: space-between; /* pushes icon to right */
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;

  &:hover {
    background: #f3f4f6;
  }
`;