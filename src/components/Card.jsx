import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {IoPlayCircleSharp} from "react-icons/io5";
import {RiThumbUpFill, RiThumbDownFill} from "react-icons/ri";
import {BsCheck} from "react-icons/bs";
import {AiOutlinePlus} from "react-icons/ai";
import {BiChevronDown} from "react-icons/bi";
import {onAuthStateChanged} from "firebase/auth";
import {firebaseAuth} from "../utils/firebase-config";
import axios from "axios";
import {removeFromLikedMovies} from "../store/store";
import {useDispatch} from "react-redux";
import {HOST} from "../utils/constants";
import {toast} from "react-toastify";

export default function Card({movieData, isLiked = false}) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(undefined);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setEmail(currentUser.email);
    } else {
      navigate("/login");
    }
  });

  const addToList = async () => {
    try {
      await axios.post(`${HOST}/api/user/add`, {
        email,
        data: movieData,
      });
      toast.info("Movie added to My List");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="movie"
      />
      {isHovered && (
        <div className="hover">
          <div className="info-container flex column">
            <h3 className="name" onClick={() => navigate("/player")}>
              {movieData.name}
            </h3>
            <div className="icons flex j-between">
              <div className="controls flex">
                <IoPlayCircleSharp
                  title="play"
                  onClick={() => navigate("/player")}
                />
                <RiThumbUpFill title="Like" />
                <RiThumbDownFill title="Dislike" />
                {isLiked ? (
                  <BsCheck
                    title="Remove from List"
                    onClick={() => {
                      dispatch(
                        removeFromLikedMovies({email, movieID: movieData.id})
                      );
                      toast.info("Movie removed from List");
                    }}
                  />
                ) : (
                  <AiOutlinePlus title="Add to my List" onClick={addToList} />
                )}
              </div>
              <div className="info">
                <BiChevronDown title="More Info" />
              </div>
            </div>
            <div className="genres flex">
              <ul className="flex">
                {movieData.genres.map((genre) => (
                  <li key={genre}>{genre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  height: 100%;
  cursor: pointer;
  position: relative;
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    z-index: 2;
    .info-container {
      margin-left: 1rem;
      gap: 0.5rem;
    }
    .icons {
      .controls {
        display: flex;
        gap: 1rem;
      }
      svg {
        font-size: 2rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #b8b8b8;
        }
      }
    }
    .genres {
      ul {
        gap: 1rem;
        li {
          padding-right: 0.7rem;
          &:first-of-type {
            list-style-type: none;
          }
        }
      }
    }
  }

  @media (max-width: 520px) {
    .hover {
      .info-container {
        padding: 0 1rem;
        margin-left: -1rem;
        h3 {
          margin-top: -1rem;
          font-size: 0.7rem;
        }
      }
      .icons {
        .controls {
          gap: 0.6rem;
          margin-left: -0.6rem;
        }
        svg {
          font-size: 1rem;
        }
      }
      .genres {
        ul {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.6rem;
          li {
            padding-right: 0.5rem;
            &:first-of-type {
              list-style-type: disc;
            }
          }
        }
      }
    }
  }
`;
