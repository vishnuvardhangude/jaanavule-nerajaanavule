
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AsyncPaginate } from 'react-select-async-paginate';
import { MAX_ATTEMPTS, ROWS, COLS, CORRECT, WRONG } from '../utils/constants';
import Confetti from "react-dom-confetti";
import { useLocalStorage, useLocalStorageSet } from '../utils/storage';

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
    const [gameOver, setGameOver] = useLocalStorage("gameOver", false);
    const [gameWon, setGameWon] = useLocalStorage("gameWon", false);
    const [gameLost, setGameLost] = useLocalStorage("gameLost", false);
    const [submittedValue, setSubmittedValue] = useState(null);
    const [showConfetti, setShowConfetti] = useState(null);
    const [clickedBoxes, setClickedBoxes] = useLocalStorageSet("clickedBoxes", new Set());
    const [disableGrid, setDisableGrid] = useLocalStorage("disableGrid", false);
    const [submitCount, setSubmitCount] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [names, setNames] = useState(null);
    const [selectedOptions, setSelectedOptions] = useLocalStorage("selectedOptions", []);
    const [selectedOptionsEmoji, setSelectedOptionsEmoji] = useLocalStorage("selectedOptionsEmoji", []);
    const [revealAll, setRevealAll] = useLocalStorage("revealAll", false);
    // const [guessDistribution, setGuessDistribution] = useLocalStorageSet("guessDistribution", []);
    const [date, setDate] = useLocalStorage("date", "01/01/2026")

    const rows = ROWS;
    const cols = COLS;

    const total = rows * cols;

    useEffect(() => {

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
            today.getMonth() + 1
        ).padStart(2, "0")}/${today.getFullYear()}`;

        // console.log(formattedDate);

        if(date!=formattedDate){
        // if (date === "26/02/2026") {
            setDate(formattedDate);
            setGameLost(false);
            setGameWon(false);
            setGameOver(false);
            setShowConfetti(false);
            setClickedBoxes(new Set());
            setDisableGrid(false);
            setSelectedOptions([])
            setSelectedOptionsEmoji([])
            setRevealAll(false);
        }

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
        // console.log("gamewon ", gameWon);
        // console.log("gameLost ", gameLost)

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
        if (count > MAX_ATTEMPTS) {
            return;
        }


        if (value) {
            setSubmittedValue(value.value); // store selected name

            setSelectedOptions(prev => {
                return [...prev, value.value];
            });


            if (count < MAX_ATTEMPTS) {
                //Game won
                if (value.value === correctAnswer) {
                    setGameOver(true);
                    setGameWon(true);
                    setShowConfetti(true);
                    setDisableGrid(false);

                    setSelectedOptionsEmoji(prev => {
                        return [...prev, CORRECT];
                    });

                }
                else {
                    setDisableGrid(false);

                    setSelectedOptionsEmoji(prev => {
                        return [...prev, WRONG];
                    });
                }
            }

            else if (count === MAX_ATTEMPTS && value.value === correctAnswer) {
                setGameOver(true);
                setGameWon(true);
                setGameLost(false);
                setShowConfetti(true);
                setDisableGrid(false);

                setSelectedOptionsEmoji(prev => {
                    return [...prev, CORRECT];
                });
            }

            else if (count === MAX_ATTEMPTS && value.value != correctAnswer) {
                setGameOver(true);
                setGameLost(true);
                setDisableGrid(false);

                setSelectedOptionsEmoji(prev => {
                    return [...prev, WRONG];
                });
            }

            // console.log(disableGrid);

        }
    };

    const handleSkip = () => {

        const count = submitCount + 1;


        setSubmitCount(submitCount + 1);

        // console.log("before", disableGrid);
        // console.log(count);

        if (count > MAX_ATTEMPTS) {
            return;
        }

        setSubmittedValue("Skipped"); // store selected name

        setSelectedOptions(prev => {
            return [...prev, "Skipped"];
        });

        setSelectedOptionsEmoji(prev => {
            return [...prev, WRONG];
        });

        if (count < MAX_ATTEMPTS) {
            setDisableGrid(false);
        }

        else if (count === MAX_ATTEMPTS) {
            setGameOver(true);
            setGameLost(true);
            setDisableGrid(false);
        }

    };

    const handleBoxClick = (e, index) => {
        e.stopPropagation();

        setClickedBoxes(prev => {

            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;

        });
        console.log(clickedBoxes);


        if (gameOver) {
            setDisableGrid(false);
        }
        else {
            setDisableGrid(true);
        }

    };

    const handleReveal = (e, index) => {

        if (gameOver) {
            setRevealAll(true);
        }

    };

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

                    {imageUrl &&
                        <GridOverlay rows={rows} cols={cols}>
                            {Array.from({ length: total }).map((_, index) => (
                                <GridBox
                                    key={index}
                                    $isTransparent={clickedBoxes.has(index)}
                                    $revealAll={revealAll}
                                    $disable={disableGrid}
                                    onClick={(e) => handleBoxClick(e, index)}
                                >
                                    {index + 1}
                                </GridBox>
                            ))}
                        </GridOverlay>
                    }
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
                        <Buttons>
                            <button onClick={handleSubmit} disabled={(!value) || gameOver}>
                                Submit
                            </button>
                            <button onClick={handleSkip} disabled={gameOver}>
                                Skip
                            </button>
                            {gameOver &&
                                <button onClick={handleReveal} disabled={!gameOver}>
                                    Reveal Image
                                </button>
                            }
                        </Buttons>
                    </SearchBar>
                </div>

                {selectedOptions.length > 0 && (
                    <DisplaySelectedOptions style={{ marginTop: "10px" }}>
                        {/* <div>Selected:</div> */}
                        {selectedOptions.map((name, idx) => (
                            <div key={idx}>
                                {selectedOptionsEmoji[idx]} {name}
                            </div>
                        ))}
                    </DisplaySelectedOptions>
                )}

                {gameLost && (
                    <div style={{ marginTop: "10px" }}>
                        <div>
                            Game Lost :(
                        </div>
                        <div>
                            Correct Answer: {correctAnswer}
                        </div>
                    </div>
                )}
                {gameWon && (
                    <div style={{ marginTop: "10px" }}>
                        <div>
                            Game Won!!!
                        </div>
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
  width: 90%;
  max-width: 500px;   /* prevents too big on desktop */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;
  gap: 1rem;
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 2px auto;
    align-items: center;

    button {
        width: 100px;
        height: 30px;
        flex-shrink: 0;
        margin: 3px;
        background-color: rgba(12, 87, 236, 0.8);
        color: white;
        border-radius: 5px;
        opacity: 1.0;
        text-transform: uppercase;
        font-size: 12px;
        cursor: pointer;
        border: none;
        outline: none;
        &:hover {
            transform:  scale(1.02);
        }

    }
`


const SearchBar = styled.div`
    width: 350px;
    // display: flex;
    gap: 10px;
    margin: 1px auto;

    .react-select__control {
        flex: 1;          /* takes available space */
        min-width: 0;     /* prevents flex overflow issues */
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
    // font-size: 5px;
    font-size: clamp(2px, 2vw, 15px);
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.3s ease, transform 0.2s;
    opacity: ${props => (props.$revealAll || props.$isTransparent) ? '0' : '1'};
    pointer-events: ${props => (props.$isTransparent || props.$disable) ? 'none' : 'auto'};

    &:hover {
        transform: ${props => (props.$isTransparent || props.$revealAll) ? 'none' : 'scale(1.1)'};
    }
`;

const DisplaySelectedOptions = styled.div`
  display: flex;
  flex-direction: column;
`;