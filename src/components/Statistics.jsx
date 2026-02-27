import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { range } from 'lodash';
import { MAX_ATTEMPTS } from '../utils/constants';
import Confetti from 'react-dom-confetti';

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


function Statistics({
  isOpen,
  onClose,
  statsObj,
  guessDistribution,
  gameWon,
  gameLost,
  afterGame
}) {
  if (!isOpen) return null;

  const [counts, setCounts] = useState({});
  const [showConfetti, setShowConfetti] = useState(null);

  useEffect(() => {
    // Ensure guessDistribution is always an array
    const distArray = Array.isArray(guessDistribution) ? guessDistribution : [];

    // Create counts object
    const newCounts = distArray.reduce((acc, num) => {
      acc[num] = (acc[num] || 0) + 1;
      return acc;
    }, {});

    setCounts(newCounts);

    if (gameWon && afterGame) {
      setShowConfetti(true);
    }

  }, []);

  // Maximum count for scaling bar widths
  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>✕</CloseButton>

          {afterGame && gameWon &&
            <>
              <Note>
                <h2>Congratulations!!!</h2>
              </Note>
              <hr />
            </>

          }
          {afterGame && gameLost &&
            <>
              <Note>
                <h2>Thanks for playing today!!</h2>
              </Note>
              <hr />
            </>
          }

          <h2>Statistics</h2>
          <hr />

          <StatsBar>
            <div>
              <StatValue>{statsObj.gamesPlayed}</StatValue>
              <StatLabel>Played</StatLabel>
            </div>
            <div>
              <StatValue>{statsObj.gamesWon}</StatValue>
              <StatLabel>Won</StatLabel>
            </div>
            <div>
              <StatValue>
                {statsObj.gamesPlayed > 0
                  ? Math.round((statsObj.gamesWon / statsObj.gamesPlayed) * 100)
                  : 0}
              </StatValue>
              <StatLabel>Win %</StatLabel>
            </div>
            <div>
              <StatValue>{statsObj.currentStreak}</StatValue>
              <StatLabel>Current Streak</StatLabel>
            </div>
            <div>
              <StatValue>{statsObj.maxStreak}</StatValue>
              <StatLabel>Max Streak</StatLabel>
            </div>
          </StatsBar>

          <hr />
          <h3>Guess Distribution</h3>

          <div className="guess-distribution">
            {range(1, MAX_ATTEMPTS + 1).map((guessNumber) => {
              const count = counts[guessNumber] || 0;
              const totalGuesses = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

              // Width is literally the percentage of total guesses
              const widthPercent = Math.round((count / totalGuesses) * 100);

              return (
                <GuessBarRow key={guessNumber}>
                  {/* Guess number */}
                  <div className="guess-number w-8 text-right font-bold">{guessNumber}</div>

                  {/* Bar container */}
                  <BarContainer>
                    {/* Bar fills widthPercent of container */}
                    <Bar style={{ width: `${widthPercent}%` }} />

                    {/* Count immediately after bar */}
                    <Count>{widthPercent}%</Count>
                  </BarContainer>
                </GuessBarRow>
              );
            })}
          </div>
        </ModalContent>
        <div
          className="flex justify-center"
          style={{
            position: "absolute",
            top: "55%",
            left: "50%"
          }}>
          <Confetti active={showConfetti} config={config} />
        </div>
      </ModalOverlay>

    </>
  );
}

export default Statistics;

/* Styled Components */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: white;
  width: 90%;
  max-width: 500px;
  padding: 24px;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;

    h1 {
    font-size: 32px;
    font-weight: 700;
    font-family: Rockwell, serif;
  }

  h2 {
    font-size: 16px;
    font-weight: 700;
    font-family: Rockwell, serif;
    text-transform: uppercase;
  }

  h3 {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
  }

  hr {
    margin: 10px 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2px auto;
`;

const StatValue = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 150;
  text-align: center;
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 150;
`;

const GuessBarRow = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
`;

const BarContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  height: 24px;
  background-color: #ffffff; /* gray background */
  border-radius: 4px;
  margin: 0 8px;
`;

const Bar = styled.div`
  height: 100%;
  background-color: #10b981; /* green */
  border-radius: 2px; /* rounded only on left */
`;

const Count = styled.div`
  margin-left: 8px; /* small gap after bar */
  font-weight: bold;
  font-family: 'Inter', sans-serif;
  // font-weight: 100;
`;

const Note = styled.div`
  display: flex;
  flex-direction: column; /* so h2 and hr stack vertically */

`;