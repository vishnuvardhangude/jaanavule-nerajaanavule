import React, { useState } from 'react';
import styled from 'styled-components';
import { AsyncPaginate } from 'react-select-async-paginate';
import namesData from '../data/Names.json';

function Game() {
    const [value, setValue] = useState(null);

    const handleOnChange = (searchData) => {
        // console.log(searchData);
        // console.log("INPUT:", JSON.stringify(searchData));
        setValue(searchData.value);
    }

    const loadOptions = async (inputValue) => {
        if (!inputValue) {
            return { options: [] };
        }
        // console.log("INPUT:", JSON.stringify(inputValue));
        // Filter names from Names.json based on inputValue
        const filtered = namesData.names
            .filter(name => name.toLowerCase().includes(inputValue.toLowerCase()))
            .slice(0,8)
            .map(name => ({ label: name, value: name }));
        return { options: filtered };
    } 

    return (
        <Wrap>

            <img src="/images/image1.jpg" alt="game visual" />

            <SearchBar>
                <AsyncPaginate 
                    placeholder="Enter the Celebrity Name"
                    loadOptions={loadOptions}
                    value={value}
                    onChange={handleOnChange}
                />
            </SearchBar>
        </Wrap>
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
    max-width: 100%;
    align-self: center;
`
