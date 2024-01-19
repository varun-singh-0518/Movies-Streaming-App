import {configureStore, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

// Initializes the Redux state with three properties.
const initialState = {
  movies: [], //an array to store movie data
  genresLoaded: false, //a boolean to track whether genres have been loaded
  genres: [], //an array to store movie genres
};

//an asynchronous thunk action creator to fetch movie genres from TMDb API.
export const getGenres = createAsyncThunk("netflix/genres", async () => {
  const {
    data: {genres},
  } = await axios.get(
    `${process.env.REACT_APP_TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}`
  );
  return genres;
});

export const fetchMovies = createAsyncThunk(
  "netflix/trending",
  async ({type}, thunkApi) => {
    const {
      netflix: {genres},
    } = thunkApi.getState(); // Extracts the genres from the Redux store using thunkApi.getState().
    const movies = await getRawData(
      `${process.env.REACT_APP_TMDB_BASE_URL}/trending/${type}/week?api_key=${process.env.REACT_APP_API_KEY}`,
      genres,
      true
    );
    return movies;
  }
);

// function to get the raw data from api.
// api: The base API URL for fetching movie data.
// genres: An array containing information about movie genres.
// paging: A boolean indicating whether pagination should be used.
const getRawData = async (api, genres, paging) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: {results},
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

//This function takes three parameters:
// array: An array of raw movie data.
// moviesArray: An array where the processed movie data will be stored.
// genres: An array containing information about movie genres.
const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    //an empty array for storing the names of genres associated with the current movie.
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({id}) => id === genre);
      //if a matching genre is found, its name property is pushed into the movieGenres array.
      if (name) {
        movieGenres.push(name.name);
      }
    });
    if (movie.backdrop_path) {
      moviesArray.push({
        id: movie.id,
        name: movie.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
    }
  });
};

export const fetchDataByGenre = createAsyncThunk(
  "netflix/moviesByGenres",
  async ({genre, type}, thunkApi) => {
    const {
      netflix: {genres},
    } = thunkApi.getState();
    return getRawData(
      `${process.env.REACT_APP_TMDB_BASE_URL}/discover/${type}?api_key=${process.env.REACT_APP_API_KEY}&with_genres=${genre}`,
      genres
    );
  }
);

export const getUserLikedMovies = createAsyncThunk(
  "netflix/getLiked",
  async (email) => {
    const movie = await axios.post(
      `${process.env.REACT_APP_HOST}/api/user/liked`,
      {
        email,
      }
    );
    const movies = movie.data;
    return movies;
  }
);

export const removeFromLikedMovies = createAsyncThunk(
  "netflix/deleteLiked",
  async ({email, movieID}) => {
    const movie = await axios.put(
      `${process.env.REACT_APP_HOST}/api/user/delete`,
      {
        email,
        movieID,
      }
    );

    const movies = movie.data;
    return movies;
  }
);

//createSlice function is part of the Redux Toolkit and is used to create a Redux slice.
//A slice contains the reducer logic and initial state for a specific portion of the Redux store.
const NetflixSlice = createSlice({
  name: "Netflix",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUserLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeFromLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const store = configureStore({
  //reducer: The reducers are combined and passed to the store.
  //In this case, there is only one slice named "Netflix," and its reducer is added to the store.
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});
