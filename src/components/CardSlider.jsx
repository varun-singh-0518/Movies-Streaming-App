import React from "react";
import Card from "./Card";
import styled from "styled-components";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function CardSlider({data, title}) {
  const responsive = {
    desktop: {
      breakpoint: {max: 2000, min: 1360},
      items: 6,
      slidesToSlide: 6, // optional, default to 1.
    },
    smallDesktop: {
      breakpoint: {max: 1360, min: 830},
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: {max: 830, min: 580},
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    mobile: {
      breakpoint: {max: 580, min: 0},
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
  };

  return (
    <Container className="flex column">
      <h1>{title}</h1>
      <div className="wrapper">
        <Carousel responsive={responsive}>
          {data.map((movie, index) => {
            return <Card movieData={movie} index={index} key={movie.id} />;
          })}
        </Carousel>
      </div>
    </Container>
  );
}

const Container = styled.div`
  gap: 1rem;
  position: relative;
  padding: 2rem 0;
  h1 {
    margin-left: 50px;
  }
  .wrapper {
    margin: 1rem;
  }

  @media (max-width: 520px) {
    padding: 1rem 0;
    h1 {
      margin-left: 30px;
      font-size: 1.5rem;
    }
  }
`;
