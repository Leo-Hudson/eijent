"use client";

import { Features } from "./Features";
import { HeroSection } from "./HeroSection";
import { WaitlistBanner } from "./WaitlistBanner";

export const Home = ({ data }) => {

  return (
    <>
      {/* <h1 style={{ fontFamily: 'cursive', fontSize: "9.5rem", textAlign: "center", color: "#5578fa" }}>{data.headline}</h1> */}
      <HeroSection />
      <Features />
      <WaitlistBanner />
    </>
  )
}
