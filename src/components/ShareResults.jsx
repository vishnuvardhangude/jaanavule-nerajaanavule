import React from 'react'

import { FaSquareWhatsapp } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import styled from 'styled-components';
import { SITE_URL } from '../utils/constants';

const ShareResults = ({
    formattedDate, 
    gameWon, 
    selectedOptionsEmoji,
    gameNumber,
    mode,
    submitCount
}) => {

    const handleWhatsappShare = () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank");
    };

    const handleTwitterShare = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank");
    };

    const shareText = `Jaanavule Nerajaanavule Game ${gameNumber}${mode==="daily" ? "" : "(Time Travelled)"}\
: ${gameWon ? "0" : submitCount}/5\n\n${selectedOptionsEmoji.join("")}\n\n${SITE_URL}\n#JaanavuleNerajaanavule  #JaaNeja`;


    return (
        <div>
            SHARE

            <ShareIcons>
                <WhatsappIcon onClick={handleWhatsappShare} />
                <TwitterXIcon onClick={handleTwitterShare} />
            </ShareIcons>
        </div>
    )
}

export default ShareResults


// const ShareIcons = styled.div`
//     display: flex;
//     // flex-direction: row;
//     // justify-content: space-between;
//     // align-items: center;
//     margin: 0 auto;
// `
// Wrapper for all icons
const ShareIcons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px; /* spacing between icons */
`;

// Individual sizes
const WhatsappIcon = styled(FaSquareWhatsapp)`
  width: 30px;
  height: 30px;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
`;

const TwitterXIcon = styled(BsTwitterX)`
  width: 25px;
  height: 25px;
  cursor: pointer;

  &:hover {
    transform: scale(1.15);
  }
`;