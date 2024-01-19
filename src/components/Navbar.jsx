import React, {useState} from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import {NavLink, useNavigate} from "react-router-dom";
import {FaPowerOff, FaSearch} from "react-icons/fa";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {firebaseAuth} from "../utils/firebase-config";
import {GiHamburgerMenu} from "react-icons/gi";

export default function Navbar({isScrolled}) {
  const links = [
    {name: "Home", link: "/"},
    {name: "TV Shows", link: "/tv"},
    {name: "Movies", link: "/movies"},
    {name: "My List", link: "/mylist"},
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(firebaseAuth);
    // Clear local storage
    localStorage.clear();
  };

  //to listen for changes in the user's authentication state.
  onAuthStateChanged(firebaseAuth, (currentUser) => {
    //If there is no authenticated user (!currentUser), it navigates to the "/login" route.
    if (!currentUser) {
      navigate("/login");
    }
  });

  //Manages the visibility of the search component.
  const [showSearch, setShowSearch] = useState(false);
  //Tracks whether the search input is being hovered.
  const [inputHover, setInputHover] = useState(false);
  //Manages the state of the mobile menu.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Container>
      <nav className={`flex ${isScrolled ? "scrolled" : ""}`}>
        <div className="left flex a-center">
          <div
            className="menu-icon"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            <GiHamburgerMenu />
            <ul className={`menu-links ${menuOpen ? "open" : ""}`}>
              {links.map(({name, link}) => {
                return (
                  <li key={name}>
                    <NavLink to={link}>{name}</NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="brand flex a-center j-center">
            <img src={logo} alt="logo" />
          </div>
          <ul className="links flex">
            {links.map(({name, link}) => {
              return (
                <li key={name}>
                  <NavLink to={link}>{name}</NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="right flex a-center">
          <div className={`search ${showSearch ? "show-search" : ""}`}>
            <button
              onFocus={() => setShowSearch(true)}
              onBlur={() => {
                if (!inputHover) {
                  setShowSearch(false);
                }
              }}
            >
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Search"
              onMouseEnter={() => setInputHover(true)}
              onMouseLeave={() => setInputHover(false)}
              onBlur={() => {
                setShowSearch(false);
                setInputHover(false);
              }}
            />
          </div>
          <button className="logout" onClick={handleLogout}>
            <FaPowerOff />
          </button>
        </div>
      </nav>
    </Container>
  );
}

const Container = styled.div`
  .scrolled {
    background-color: black;
  }
  nav {
    position: sticky;
    top: 0;
    height: 6.5rem;
    width: 100%;
    justify-content: space-between;
    position: fixed;
    z-index: 2;
    padding: 0 4rem;
    align-items: center;
    transition: 0.3s ease-in-out;
    .left {
      gap: 2rem;
      .brand {
        img {
          height: 4rem;
        }
      }
      .menu-icon {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 1rem;
        font-size: 2rem;
        cursor: pointer;
      }
      .links {
        list-style-type: none;
        gap: 2rem;
        li {
          a {
            color: white;
            text-decoration: none;
          }
        }
      }
    }
    .right {
      gap: 1rem;
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:focus {
          outline: none;
        }
        svg {
          color: #f34242;
          font-size: 1.2rem;
        }
      }
      .search {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        padding-left: 0.5rem;
        button {
          background-color: transparent;
          svg {
            color: white;
          }
        }
        input {
          width: 0;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
          background-color: transparent;
          border: none;
          color: white;
          &:focus {
            outline: none;
          }
        }
      }
      .show-search {
        border: 1px solid white;
        background-color: rgba(0, 0, 0, 0.6);
        input {
          width: 100%;
          opacity: 1;
          visibility: visible;
          padding: 0.3rem;
        }
      }
    }
  }

  @media (max-width: 520px) {
    .scrolled {
      background-color: transparent;
    }
    nav {
      margin-top: 0.5rem;
      height: 11.2rem;
      align-items: flex-start;
      .left {
        gap: 1rem;
        .brand {
          img {
            display: none;
            height: 4rem;
          }
        }
        .menu-icon {
          display: flex;

          .menu-links {
            display: none;
            font-size: 1.5rem;
            flex-direction: column;
            list-style-type: none;
            gap: 0.2rem;
            top: 0;
            width: 100%;
          }
          .open {
            display: flex;
          }
          li {
            a {
              color: white;
              text-decoration: none;
            }
          }
        }
      }
      .links {
        display: none;
      }
      .right {
        .logout {
          margin-right: -3rem;
        }
      }
    }
  }
`;
