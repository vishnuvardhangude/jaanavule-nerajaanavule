import React, { useState } from "react";
import styled from "styled-components";

const ImageCover = () => {
  const [clickedBoxes, setClickedBoxes] = useState(new Set());

  const rows = 4;
  const cols = 6;

  const total = rows * cols;

  const boxes = Array.from({ length: total });

  const handleBoxClick = (e, index) => {
    // e.stopPropagation();
    setClickedBoxes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <>
      <Wrap>
        <ImageWrapper>
          <img src="/images/image1.jpg" alt="game visual" />
          <GridOverlay rows={rows} cols={cols}>
            {boxes.map((_, index) => (
              <GridBox key={index} $isTransparent={clickedBoxes.has(index)} onClick={(e) => handleBoxClick(e, index)}>
                {index + 1}
              </GridBox>
            ))}
          </GridOverlay>

        </ImageWrapper>
      </Wrap>
    </>
  );
};

export default ImageCover;


const Wrap = styled.div`    
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;           /* horizontal center */
  gap: 1rem;
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
  height: 100%;              /* ensure overlay matches image size */
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
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.2s;
  opacity: ${props => props.$isTransparent ? '0' : '1'};
  pointer-events: ${props => props.$isTransparent ? 'none' : 'auto'};

  &:hover {
    transform: ${props => props.$isTransparent ? 'none' : 'scale(1.1)'};
  }
`


// .box:hover {
//   transform: scale(1.1);
// }