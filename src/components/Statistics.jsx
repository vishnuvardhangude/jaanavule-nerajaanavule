
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

function Statistics({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>✕</CloseButton>

                <h2>Statistics</h2>
                <hr />
                <StatsBar>
                  <ul>Played</ul>
                  <ul>Win %</ul>
                  <ul>Current Streak</ul>
                  <ul>Max Streak</ul>
                </StatsBar>
                <hr />

                <ul>
                    <li>Click a tile to reveal part of the image and guess the Celebrity.</li>
                    <li>If you're unsure, reveal more tiles.</li>
                </ul>

                
            </ModalContent>
        </ModalOverlay>
    )
}

export default Statistics

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 50;
`

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
    margin: 2px;
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

const StatsBar = styled.div`
  display: flex;
  margin: 2px;
`