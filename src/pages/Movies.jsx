import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchMovies, getGenres} from "../store/store";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import NotAvailable from "../components/NotAvailable";
import SelectGenre from "../components/SelectGenre";

export default function Movies() {
  const [isScrolled, setIsScrolled] = useState(false);

  //genresLoaded: Uses the useSelector hook to extract the value of genresLoaded from the Redux store.
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);

  //Retrieves the movies array from the Redux store
  const movies = useSelector((state) => state.netflix.movies);

  //Retrieves the genres array from the Redux store. This array typically represents the available genres for movies.
  const genres = useSelector((state) => state.netflix.genres);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    //This ensures that movies are fetched only after genres have been loaded.
    if (genresLoaded) {
      dispatch(fetchMovies({type: "movie"}));
    }
  }, [dispatch, genresLoaded]);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <Container>
      <div className="navbar">
        <Navbar isScrolled={isScrolled} />
      </div>
      <div className="data">
        <SelectGenre genres={genres} type="movie" />
        {/* render either a Slider component (if movies array has length) or a NotAvailable component (if movies array is empty). */}
        {movies.length ? <Slider movies={movies} /> : <NotAvailable />}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .data {
    margin-top: 8rem;
    .not-available {
      text-align: center;
      color: white;
      margin-top: 4rem;
    }
  }
`;
