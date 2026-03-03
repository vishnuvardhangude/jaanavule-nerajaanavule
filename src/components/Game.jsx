
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AsyncPaginate } from 'react-select-async-paginate';
import Confetti from "react-dom-confetti";
import { MAX_ATTEMPTS, ROWS, COLS, CORRECT, WRONG } from '../utils/constants';
import { useLocalStorage, useLocalStorageSet } from '../utils/storage';
import Statistics from './Statistics';
import ShareResults from './ShareResults';


// function Game(imageUrl, names, setNames, correctAnswer) {


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

const Game = ({
    imageUrl,
    names,
    correctAnswer,
    stats,
    setStats,
    statsObj,
    guessDistribution,
    setGuessDistribution,
    formattedDate,
    setFormattedDate,
    gameNumber,
    mode = "daily"
}) => {

    const [revealAll, setRevealAll] = mode === "daily"
        ? useLocalStorage("revealAll", false) : useState(false);

    const [today, setToday] = useLocalStorage("today", "01/01/2026");


    const [selectedOptions, setSelectedOptions] = mode === "daily"
        ? useLocalStorage("selectedOptions", []) : useState([]);
    const [selectedOptionsEmoji, setSelectedOptionsEmoji] = mode === "daily"
        ? useLocalStorage("selectedOptionsEmoji", []) : useState([]);
    const [clickedBoxes, setClickedBoxes] = mode === "daily"
        ? useLocalStorageSet("clickedBoxes", new Set()) : useState(new Set());
    const [disableGrid, setDisableGrid] = mode === "daily"
        ? useLocalStorage("disableGrid", false) : useState(false);
    const [gameOver, setGameOver] = mode === "daily"
        ? useLocalStorage("gameOver", false) : useState(false);
    const [gameWon, setGameWon] = mode === "daily"
        ? useLocalStorage("gameWon", false) : useState(false);
    const [gameLost, setGameLost] = mode === "daily"
        ? useLocalStorage("gameLost", false) : useState(false);
    const [submitCount, setSubmitCount] = mode === "daily"
        ? useLocalStorage("submitCount", false) : useState(0);



    const [value, setValue] = useState(null);
    const [submittedValue, setSubmittedValue] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [showConfetti, setShowConfetti] = useState(null);


    // console.log(imageUrl)

    const rows = ROWS;
    const cols = COLS;

    const total = rows * cols;


    const resetGame = () => {
        setGameLost(false);
        setGameWon(false);
        setGameOver(false);
        setClickedBoxes(new Set());
        setDisableGrid(false);
        setSelectedOptions([]);
        setSelectedOptionsEmoji([]);
        setRevealAll(false);
    };

    useEffect(() => {

        console.log("useeffect Game.jsx ", today, formattedDate)

        if (mode !== "daily") {
            return;
        }

        const realToday = new Date();
        const todayString = `${String(realToday.getDate()).padStart(2, "0")}/${String(
            realToday.getMonth() + 1
        ).padStart(2, "0")}/${realToday.getFullYear()}`;

        // setToday(todayString);
        console.log("formattedDate", formattedDate);
        console.log("today", todayString)

        if (formattedDate !== todayString) {
            resetGame();
            setFormattedDate(todayString);
        }

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
                    setShowStats(true);
                    setGameWon(true);
                    setDisableGrid(false);

                    setShowConfetti(true);

                    setSelectedOptionsEmoji(prev => {
                        return [...prev, CORRECT];
                    });

                    if (mode === "daily") {
                        setStats(
                            JSON.stringify({
                                gamesPlayed: statsObj.gamesPlayed + 1,
                                gamesWon: statsObj.gamesWon + 1,
                                currentStreak: statsObj.maxStreak + 1,
                                maxStreak: statsObj.maxStreak + 1
                            })
                        );

                        // console.log("guessDistribution", guessDistribution)

                        setGuessDistribution([...guessDistribution, count])
                    }
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
                setShowStats(true);

                setGameWon(true);
                setShowConfetti(true);

                setGameLost(false);
                setDisableGrid(false);

                setSelectedOptionsEmoji(prev => {
                    return [...prev, CORRECT];
                });

                if (mode === "daily") {
                    setStats(
                        JSON.stringify({
                            gamesPlayed: statsObj.gamesPlayed + 1,
                            gamesWon: statsObj.gamesWon + 1,
                            currentStreak: statsObj.maxStreak + 1,
                            maxStreak: statsObj.maxStreak + 1
                        })
                    );
                    setGuessDistribution([...guessDistribution, count])
                }
                // console.log("count", count)

            }

            else if (count === MAX_ATTEMPTS && value.value != correctAnswer) {
                setGameOver(true);
                setShowStats(true);
                setGameLost(true);
                setDisableGrid(false);

                setSelectedOptionsEmoji(prev => {
                    return [...prev, WRONG];
                });

                if (mode === "daily") {
                    setStats(
                        JSON.stringify({
                            gamesPlayed: statsObj.gamesPlayed + 1,
                            gamesWon: statsObj.gamesWon,
                            currentStreak: 0,
                            maxStreak: statsObj.maxStreak
                        })
                    );
                }
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
            setShowStats(true);

            if (mode === "daily") {
                setStats(
                    JSON.stringify({
                        gamesPlayed: statsObj.gamesPlayed + 1,
                        gamesWon: statsObj.gamesWon,
                        currentStreak: 0,
                        maxStreak: statsObj.maxStreak
                    })
                );
            }
        }

    };

    const handleBoxClick = (e, index) => {
        e.stopPropagation();

        setClickedBoxes(prev => {

            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;

        });
        // console.log(clickedBoxes);


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
                            key={imageUrl}

                            src={imageUrl}
                            alt="game visual"
                            style={{ maxWidth: "100%" }}
                            onError={(e) => {
                                // console.error(e)
                                // console.error("Image failed:", e.target.src);

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
                    {selectedOptions.length > 0 && (
                        <DisplaySelectedOptions style={{ marginTop: "10px" }}>
                            {/* <div>Selected:</div> */}
                            {selectedOptions.map((name, idx) => (
                                <div key={idx} style={{ marginTop: "10px" }}>
                                    {selectedOptionsEmoji[idx]} {name}
                                </div>
                            ))}
                        </DisplaySelectedOptions>
                    )}

                </div>



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

                {mode === "daily" && gameOver &&
                    <Statistics
                        isOpen={showStats}
                        onClose={() => setShowStats(false)}
                        stats={stats}
                        statsObj={statsObj}
                        guessDistribution={guessDistribution}
                        gameWon={gameWon}
                        gameLost={gameLost}
                        afterGame={true}
                    />
                }
                <div
                    className="flex justify-center"
                    style={{
                        position: "absolute",
                        top: "55%",
                        left: "50%"
                    }}>
                    <Confetti active={showConfetti} config={config} />
                </div>

                {gameOver &&
                    <ShareResults
                        formattedDate={formattedDate}
                        gameWon={gameWon}
                        selectedOptionsEmoji={selectedOptionsEmoji}
                        gameNumber={gameNumber}
                        mode={mode}
                        submitCount={submitCount}
                    />
                }

            </Wrap>


        </>
    )
}

export default Game


const Wrap = styled.div`
  width: 100%;
  max-width: 350px;   /* prevents too big on desktop */
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
        width: 110px;
        height: 30px;
        flex-shrink: 0;
        margin: 3px;
        // background-color: rgba(12, 87, 236, 0.8);
        background-color: rgba(0, 0, 0, 0.8);

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
    width: 100%    
    max-width: 350px;
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
//   height: 100%;   /* MUST have height */
  max-width: 350px;
  height: auto;
  margin: 0 auto;
  img {
    width: 100%;
    // height: 100%;
    height: auto;

    object-fit: cover;
    display: block;
    // max-height: 700px;
  }
`;


const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
//   height: 100%;
max-width: 350px;
height: auto;
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 1fr);  /* columns */
  grid-template-rows: repeat(${props => props.rows}, 1fr);     /* rows */
  pointer-events: auto;
`;

const GridBox = styled.div`
    // background-color: #4f46e5; 
    background-color: #000000; 

    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;        /* fill the grid cell */
    // font-size: 5px;
    font-size: clamp(2px, 2vw, 15px);
    // border: black;
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
//   text-align:left;
//   align-items: flex-start !important;
margin: 0 auto;

`;