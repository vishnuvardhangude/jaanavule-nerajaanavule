// ...existing code...
import React, { useState } from 'react'
import { MdEqualizer, MdHistory, MdHelpOutline } from 'react-icons/md'
import styled from 'styled-components'
import Instructions from './Instructions';
import Statistics from './Statistics';

function Menu() {
    const [showInstructions, setShowInstructions] = useState(false);
    const [showStats, setShowStats] = useState(false);


    return (
        <>
            <ButtonWrapper>
                {/* <button onClick={() => setShowStats(true)}>
                    <MdEqualizer />
                </button> */}

                {/* <button>
                <MdHistory/>
            </button> */}

                <button onClick={() => setShowInstructions(true)}>
                    <MdHelpOutline />
                </button>
            </ButtonWrapper>

            {showStats &&
                <Statistics isOpen={showStats}
                    onClose={() => setShowStats(false)}
                />
            }

            {showInstructions &&
                <Instructions
                    isOpen={showInstructions}
                    onClose={() => setShowInstructions(false)}
                />
            }
        </>
    )
}

export default Menu

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 10px 15px;
    align-items: center;


    button {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
        margin: 15px;
        background-color: rgba(255, 255, 255, 0.8);
        color: white;
        // border-radius: 5px;
        opacity: 1.0;
        text-transform: uppercase;
        cursor: pointer;
        // border: none;
        // outline: none;
                font-size: 25px;

        &:hover {
            transform:  scale(1.02);
        }
}

`

