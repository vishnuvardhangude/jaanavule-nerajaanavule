
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AsyncPaginate } from 'react-select-async-paginate';
import namesData from '../data/Names.json';
import Confetti from "react-dom-confetti";

const config = {
    angle: "180",
    spread: 300,
    startVelocity: "30",
    elementCount: 70,
    dragFriction: 0.12,
    duration: "2000",
    stagger: "2",
    width: "10px",
    height: "10px",
    perspective: "900px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

function Game() {
    const [value, setValue] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [submittedValue, setSubmittedValue] = useState(null);
    const [showConfetti, setShowConfetti] = useState(null);
    const [clickedBoxes, setClickedBoxes] = useState(new Set());
    const [disableGrid, setDisableGrid] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [names, setNames] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const rows = 7;
    const cols = 7;

    const total = rows * cols;

    useEffect(() => {
        // console.log("start", new Date())
        const fetchGameData = async () => {
            try {
                const gameDataUrl = import.meta.env.VITE_GAME_DATA_URL;
                const namesDataUrl = import.meta.env.VITE_NAMES_DATA_URL;

                if (!gameDataUrl || !namesDataUrl) {
                    console.error("Env variables not set");
                    return;
                }

                // ✅ Fetch both at same time
                const [res1, res2] = await Promise.all([
                    fetch(gameDataUrl),
                    fetch(namesDataUrl)
                ]);

                const [data, namesData] = await Promise.all([
                    res1.json(),
                    res2.json()
                ]);

                const formatted = namesData.map(item => item.Celebrities);

                // console.log(formatted);
                setNames(formatted);

                // Get today's date in DD/MM/YYYY format
                const today = new Date();
                const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
                    today.getMonth() + 1
                ).padStart(2, "0")}/${today.getFullYear()}`;

                const todayRow = data.find(row => row.Date === formattedDate);

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
                } else {
                    console.log("No game data for today:", formattedDate);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchGameData();
        // console.log("end", new Date())
    }, []);


    const handleOnChange = (searchData) => {
        // console.log(searchData);
        // console.log("INPUT:", JSON.stringify(searchData));
        setValue(searchData);
    }

    const loadOptions = async (inputValue) => {
        if (!inputValue) {
            return { options: [] };
        }
        // console.log(names)
        // Filter names from Names.json based on inputValue and exclude selected value
        const filtered = names
            .filter(name => name.toLowerCase().includes(inputValue.toLowerCase()))
            .filter(name => name !== value) // Exclude selected value
            .slice(0, 8)
            .map(name => ({ label: name, value: name }));

        return { options: filtered };
    }

    const handleSubmit = () => {

        const count = submitCount + 1;

        setSubmitCount(submitCount + 1);
        // console.log("before", disableGrid);
        if (count > 5) {
            return;
        }



        if (value) {
            setSubmittedValue(value.value); // store selected name

            setSelectedOptions(prev => {
                return [...prev, value.value];
            });

            if (count < 5) {
                //Game won
                if (value.value === correctAnswer) {
                    setGameOver(true);
                    setGameWon(true);
                    setShowConfetti(true);
                    setDisableGrid(false);
                }
                else {
                    setDisableGrid(false);
                }
            }

            else if (count === 5 && value.value === correctAnswer) {
                setGameOver(true);
                setGameWon(true);
                setGameLost(false);
                setShowConfetti(true);
                setDisableGrid(false);
            }

            else if (count === 5 && value.value != correctAnswer) {
                setGameOver(true);
                setGameLost(true);
                setDisableGrid(false);
            }

            // console.log(disableGrid);

        }
    };

    const handleBoxClick = (e, index) => {
        e.stopPropagation();

        setClickedBoxes(prev => {

            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;

        });

        if (gameOver) {
            setDisableGrid(false);
        }
        else {
            setDisableGrid(true);
        }

    }

    return (
        <>
            <Wrap>
                <ImageWrapper>

                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="game visual"
                            style={{ maxWidth: "100%" }}
                            onError={(e) => {
                                console.error("Image failed to load:", imageUrl);
                                // e.target.src = {imageUrl}; // Fallback to local image
                            }}
                        />
                    ) : (
                        <p>Loading image...</p>
                    )}

                    <GridOverlay rows={rows} cols={cols}>
                        {Array.from({ length: total }).map((_, index) => (
                            <GridBox
                                key={index}
                                $isTransparent={clickedBoxes.has(index)}
                                $disable={disableGrid}
                                onClick={(e) => handleBoxClick(e, index)}
                            >
                                {index + 1}
                            </GridBox>
                        ))}
                    </GridOverlay>
                </ImageWrapper>
                <div>
                    <SearchBar>
                        <AsyncPaginate
                            placeholder="Enter the Celebrity Name"
                            loadOptions={loadOptions}
                            value={value}
                            onChange={handleOnChange}
                            isDisabled={gameOver}
                        />
                        <button onClick={handleSubmit} disabled={(!value) || gameOver}>
                            Submit
                        </button>
                    </SearchBar>
                </div>
                {selectedOptions.length > 0 && (
                    <DisplaySelectedOptions style={{ marginTop: "20px" }}>
                        <div>Selected:</div>
                        {selectedOptions.map((name, idx) => (
                            <div key={idx}>{name}</div>
                        ))}
                    </DisplaySelectedOptions>
                )}
                {gameLost && (
                    <div style={{ marginTop: "10px" }}>
                        Game Lost :(
                    </div>
                )}
                {gameWon && (
                    <div style={{ marginTop: "10px" }}>
                        Game Won!!!
                    </div>
                )}
            </Wrap>
            <div
                className="flex justify-center"
                style={{
                    position: "absolute",
                    top: "55%",
                    left: "50%"
                }}>
                <Confetti active={showConfetti} config={config} />
            </div>

        </>
    )
}

export default Game


const Wrap = styled.div`    
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;           /* horizontal center */
  gap: 1rem;
`;

const SearchBar = styled.div`
    width: 350px;
    // display: flex;
    gap: 10px;
    margin: 1px auto;

    .react-select__control {
        flex: 1;          /* takes available space */
        min-width: 0;     /* prevents flex overflow issues */
    }

    button {
        flex-shrink: 0;
    }
`;


const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;   /* MUST have height */
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 1fr);  /* columns */
  grid-template-rows: repeat(${props => props.rows}, 1fr);     /* rows */
  pointer-events: auto;
`;

const GridBox = styled.div`
  background-color: #4f46e5; 
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;        /* fill the grid cell */
  font-size: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.2s;
  opacity: ${props => props.$isTransparent ? '0' : '1'};
  pointer-events: ${props => (props.$isTransparent || props.$disable) ? 'none' : 'auto'};

  &:hover {
    transform: ${props => props.$isTransparent ? 'none' : 'scale(1.1)'};
  }
`;

const DisplaySelectedOptions = styled.div`
  display: flex;
  flex-direction: column;
`;