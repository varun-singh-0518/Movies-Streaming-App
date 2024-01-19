import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getUserLikedMovies} from "../store/store";
import {firebaseAuth} from "../utils/firebase-config";
import {onAuthStateChanged} from "firebase/auth";
import loadingSpinner from "../assets/loading.gif";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

export default function UserLiked() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.netflix.movies);

  const [email, setEmail] = useState(undefined);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setEmail(currentUser.email);
    } else {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (email) {
      dispatch(getUserLikedMovies(email))
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Error fetching liked movies:", error);
          setLoading(false);
        });
    }
  }, [dispatch, email]);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  if (loading) {
    // Render loading spinner while fetching liked movies
    return (
      <LoadingContainer>
        <img src={loadingSpinner} alt="Loading..." />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="content flex column">
        <h1>My List</h1>
        <div className="grid flex">
          {movies?.map((movie, index) => {
            return (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                isLiked={true}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    h1 {
      margin-left: 3rem;
    }
    .grid {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }

  @media (max-width: 520px) {
    .content {
      margin-top: 2.5rem;
      gap: 2rem;
      h1 {
        font-size: 1.7rem;
      }
      .grid {
        margin-left: 2rem;
      }
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  img {
    width: 20vw;
    height: 30vh;
  }
`;
