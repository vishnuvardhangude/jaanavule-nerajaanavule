import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ImageCover = () => {
  const [clickedBoxes, setClickedBoxes] = useState(new Set());
  const [imageUrl, setImageUrl] = useState(null);
  const [imageTried, setImageTried] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const rows = 4;
  const cols = 6;

  const total = rows * cols;

  const boxes = Array.from({ length: total });

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const res = await fetch(
          "https://opensheet.elk.sh/1kAMg26hCuTGU79UFlu1sugn9lfhCyiQLXs_BmRSEYMA/GameData"
        );
        const data = await res.json();

        // Get today's date in DD/MM/YYYY format
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
          today.getMonth() + 1
        ).padStart(2, "0")}/${today.getFullYear()}`;

        const todayRow = data.find(row => row.Date === formattedDate);

        if (todayRow) {
          const driveLink = todayRow.Image;
          console.log("Drive Link from sheet:", driveLink);

          // Extract Google Drive file ID from common formats
          let fileId =
            driveLink.match(/id=([^&]+)/)?.[1] ||  // ?id=FILEID
            driveLink.match(/\/d\/([^\/]+)/)?.[1]; // /d/FILEID/

          // console.log("Extracted File ID:", fileId);

          if (fileId) {
            // Use CORS-friendly endpoint: Google's export=download endpoint
            // This works better in browsers than uc?export=view

            const finalUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

            setImageUrl(finalUrl);
            // console.log("Final Image URL:", finalUrl);
          } else if (driveLink.startsWith('http')) {
            // If it's already a full URL, try using it
            setImageUrl(driveLink);
            // console.log("Using direct URL:", driveLink);
          } else {
            console.warn("Could not extract Drive ID from:", driveLink);
          }

          setCorrectAnswer(todayRow.Answer);
        } else {
          console.log("No game data for today:", formattedDate);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchGameData();
  }, []);

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
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="game visual"
              style={{ maxWidth: "100%" }}
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                // e.target.src = "/images/image1.jpg"; // Fallback to local image
              }}
            />
          ) : (
            <p>Loading image...</p>
          )}
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