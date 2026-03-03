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
        <TopRow>
          <BackButton onClick={() => navigate("/")}>
            ← Back
          </BackButton>
          <GameNumber>
            You are now Playing Game No.: #{gameNo}
          </GameNumber>
        </TopRow>
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

// const Wrap = styled.div`
//   display: flex;
//   flex-directon: row;
//   justify-content: space-between;
//   align-items: center;
//   max-width: 350px;
//   margin: 0 auto;
// `
const Wrap = styled.div`
  width: 100%;
  max-width: 350px;
  margin: 0 auto 5px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;  /* pushes them apart */
  align-items: center;
  width: 100%;
`;

// const CalendarWrapper = styled.div`
//   margin-bottom: 16px;
//   width: 100%;
//   max-width: 350px;

//   .react-datepicker-wrapper {
//     width: 100%;
//   }

//   .react-datepicker__input-container {
//     width: 100%;
//   }

//   input {
//     width: 100%;
//     padding: 10px 14px;
//     font-size: 16px;
//     box-sizing: border-box;
//   }
// `;

const CalendarWrapper = styled.div`
  width: 100%;

  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    width: 100%;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    font-size: 16px;
    border-radius: 8px;
    box-sizing: border-box;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #333;
  padding: 0;

  &:hover {
    color: #000;
  }
`;

const GameNumber = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #444;
`;

const CalendarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center; /* center content horizontally */
  gap: 10px; /* space between icon and text */
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  box-sizing: border-box;
  color: black;
  .calendar-icon {
    position: absolute;
    left: 14px; /* left padding */
  }

  .date-text {
    flex: 1;
    text-align: center; /* center the date text */
  }

  /* optional: remove default button styles */
  &:focus {
    outline: none;
  }
`;