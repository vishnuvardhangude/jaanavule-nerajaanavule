import React, { useState } from 'react';
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

    const handleOnChange = (searchData) => {
        // console.log(searchData);
        // console.log("INPUT:", JSON.stringify(searchData));



        setValue(searchData);
    }

    const loadOptions = async (inputValue) => {
        if (!inputValue) {
            return { options: [] };
        }
        // Filter names from Names.json based on inputValue and exclude selected value
        const filtered = namesData.names
            .filter(name => name.toLowerCase().includes(inputValue.toLowerCase()))
            .filter(name => name !== value) // Exclude selected value
            .slice(0, 8)
            .map(name => ({ label: name, value: name }));

        return { options: filtered };
    }

    const handleSubmit = () => {
        if (value) {
            setSubmittedValue(value.value); // store selected name

            console.log(value.value)
            console.log(namesData.answer[0])

            //Game won
            if (value.value === namesData.answer[0]) {
                setGameOver(true);
                setGameWon(true);
                setShowConfetti(true);

            }
        }
    };

    return (
        <>
            <Wrap>
                <img src="/images/image1.jpg" alt="game visual" />
                <div>
                    <SearchBar>
                        <AsyncPaginate
                            placeholder="Enter the Celebrity Name"
                            loadOptions={loadOptions}
                            value={value}
                            onChange={handleOnChange}
                            isDisabled={gameOver}
                        />
                        <button onClick={handleSubmit} disabled={!value}>
                            Submit
                        </button>
                    </SearchBar>
                </div>
                {submittedValue && (
                    <div style={{ marginTop: "20px" }}>
                        Selected: {submittedValue}
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
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* cover = fills box, crops excess */
    display: block;
  }
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
`

