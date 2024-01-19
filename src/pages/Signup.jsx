import React, {useState} from "react";
import styled from "styled-components";
import BackgroungImage from "../components/BackgroungImage";
import Header from "../components/Header";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {firebaseAuth} from "../utils/firebase-config";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function Signup() {
  // state for controlling the visibility of the password. It will toggle between showing and hiding the password.
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
    try {
      const {email, password} = formValues;
      const methods = await fetchSignInMethodsForEmail(firebaseAuth, email);

      if (methods.length > 0) {
        // Email is already in use, show an error toast
        toast.error("Email is already in use. Please use a different email.");
      } else {
        // Email is not in use, proceed with account creation
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during sign up:", err);
      toast.error(
        "Error during sign up. Please try again with different email"
      );
    }
  };

  return (
    <Container showPassword={showPassword}>
      <BackgroungImage />
      <div className="content">
        <div className="header">
          <Header login />
        </div>

        <div className="body flex column a-center j-center">
          <div className="text flex column">
            <h1>Unlimited movies, TV shows and more</h1>
            <h4>Watch anywhere. Cancel anytime</h4>
            <h6>
              Ready to watch? Enter your email to create or restart membership
            </h6>
          </div>
          <div className="form">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                })
              }
            />
            {showPassword && (
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            )}
            {!showPassword && (
              <button onClick={() => setShowPassword(true)}>Get Started</button>
            )}
          </div>
          <button onClick={handleSignIn}>Sign Up</button>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 15vh 85vh;
    .body {
      gap: 1rem;
      .text {
        gap: 1rem;
        text-align: center;
        font-size: 2rem;
        h1 {
          padding: 0 25rem;
        }
      }
      .form {
        display: grid;
        grid-template-columns: ${({showPassword}) =>
          showPassword ? "1fr 1fr" : "2fr 1fr"};
        width: 60%;
        input {
          color: black;
          border: none;
          padding: 1.5rem;
          font-size: 1.5rem;
          border: 1px solid black;
          &:focus {
            outline: none;
          }
        }
        button {
          padding: 0.5rem 1rem;
          background-color: #e50914;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: bolder;
          font-size: 1.05rem;
        }
      }
      button {
        padding: 0.5rem 1rem;
        background-color: #e50914;
        border: none;
        cursor: pointer;
        color: white;
        border-radius: 0.2rem;
        font-weight: bolder;
        font-size: 1.05rem;
      }
    }
  }

  @media (max-width: 520px) {
    .content {
      display: flex;
      flex-direction: column;
      .header {
        margin-left: -2.5rem;
      }
      .body {
        gap: 1rem;
        .text {
          gap: 2rem;
          text-align: center;
          font-size: 2rem;
          h1 {
            padding: 0 25rem;
            font-size: 2.5rem;
          }
          h4 {
            padding: 0 5rem;
            font-size: 1.3rem;
          }
          h6 {
            padding: 0 20rem;
            font-size: 1.2rem;
          }
        }
        .form {
          display: flex;
          flex-direction: column;
          background-color: #e50914;
          margin-top: 2rem;
          input {
            padding: 1rem;
            font-size: 1rem;
          }
        }
      }
    }
  }
`;
