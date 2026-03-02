
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

function Instructions({ isOpen, onClose }) {
    if (!isOpen) return null;

    const totalTiles = 25;

    const [openTiles, setOpenTiles] = useState([]);

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        if (!isOpen) return;

        const totalTiles = 25;
        let interval;

        const timeout = setTimeout(() => {
            let closeOrder = shuffleArray([...Array(totalTiles).keys()]);

            interval = setInterval(() => {
                if (closeOrder.length > 0) {
                    const next = closeOrder.pop();
                    setOpenTiles(prev => [...prev, next]);
                } else {
                    setOpenTiles([]);
                    closeOrder = shuffleArray([...Array(totalTiles).keys()]);
                }
                // console.log("test")
            }, 200);
        }, 2000);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };

    }, [isOpen]);


    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>✕</CloseButton>

                <h2>How to Play</h2>

                <p>Guess the hidden Celebrity Name in 5 tries!</p>

                <ul>
                    <li>Click a tile to reveal part of the image and guess the Celebrity.</li>
                    <li>Enter Celebrity name and click on Submit.</li>
                    <li>If you're unsure, click on Skip and reveal more tiles.</li>
                </ul>

                <hr />

                <h3>Example:</h3>

                <GridWrapper>
                    <BackgroundImage src="peacock.jpeg" />

                    <ExampleRow>

                        {Array.from({ length: 25 }).map((_, index) => (
                            <Tile key={index} open={openTiles.includes(index)}>
                                {index + 1}
                            </Tile>
                        ))}
                    </ExampleRow>


                </GridWrapper>
            </ModalContent>
        </ModalOverlay>
    )
}

export default Instructions


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh; /* make it exactly viewport height */
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center; /* center modal vertically */
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

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  h3 {
    font-weight: 600;
    margin-bottom: 12px;
    margin-top: 12px;
  }

  p {
    margin-bottom: 12px;
    font-size: 14px;
  }

  ul {
    margin-bottom: 16px;
    font-size: 14px;
    
    li {
      margin-bottom: 8px;
    }
  }

  hr {
    margin: 16px 0;
  }
`

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
`

const ExampleRow = styled.div`
  position: relative;       /* ensures it sits above absolute image */
  display: grid;
  grid-template-columns: repeat(5, 1fr);
//   gap: 1px;
  width: max-content;
  margin-bottom: 8px;
    z-index: 1;               /* optional, to be explicit */

`
const Tile = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
//   background-color: #22c55e;
    // background-color: #4f46e5; 
    background-color: #000000; 
    color: white;

  transition: opacity 0.1s ease;
  opacity: ${props => props.open ? 0 : 1};
`

const BackgroundImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GridWrapper = styled.div`
  position: relative;
  width: 160px;   /* adjust as needed */
  height: 160px;  /* adjust as needed */
//   margin: auto;   /* center on page if you want */
  align-items: left
`;