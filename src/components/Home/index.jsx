"use client";

import { Footer } from "../Footer";

export const Home = ({ data }) => {

  return (
    <>
      <h1 style={{ fontFamily: 'cursive', fontSize: "9.5rem", textAlign: "center", color: "#5578fa" }}>{data.headline}</h1>
      <Footer />
    </>
  )
}
