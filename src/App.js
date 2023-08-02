import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import LoadingEffect from "./components/LoadingEffect";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //saving the function reference so that is does not re-created every time the component re-render.
  const getMoviesHandler = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      // const apiKey = "api_key=ef64498e81f793cbb78eaef9c83167da";
      // const baseUrl = "https://api.themoviedb.org/3";
      // const apiUrl =
      //   baseUrl + "/discover/movie?sort_by=popularity.desc&" + apiKey;
      const response = await fetch(
        "https://react-http-b9988-default-rtdb.firebaseio.com/moives.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const loadedMovies = [];
      for (let key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log("using use effect");
    getMoviesHandler();
  }, [getMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-b9988-default-rtdb.firebaseio.com/moives.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("movie created");
    console.log(data);
    getMoviesHandler();
  }

  let content;
  if (!error && !isLoading && movies.length <= 0) {
    content = <p>No movies found</p>;
  }
  if (error && !isLoading) {
    content = <p>Somethign went wrong. Try again later.</p>;
  }
  if (isLoading) {
    content = <LoadingEffect />;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={getMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {!error && !isLoading && movies.length > 0 && (
          <MoviesList movies={movies} />
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
