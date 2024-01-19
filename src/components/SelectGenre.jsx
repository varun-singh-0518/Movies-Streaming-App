import React from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {fetchDataByGenre} from "../store/store";

export default function SelectGenre({genres, type}) {
  const dispatch = useDispatch();

  return (
    <Select
      className="flex"
      onChange={(e) => {
        dispatch(
          fetchDataByGenre({
            genres, //The array of all genres.
            genre: e.target.value, //The value of the selected option
            type, //The type prop passed to the component.
          })
        );
      }}
    >
      {genres.map((genre) => {
        return (
          <option value={genre.id} key={genre.id}>
            {genre.name}
          </option>
        );
      })}
    </Select>
  );
}

const Select = styled.select`
  margin-left: 5rem;
  cursor: pointer;
  font-size: 1.4rem;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;

  @media (max-width: 520px) {
    margin-top: -7.3rem;
    margin-bottom: 4.2rem;
  }
`;
