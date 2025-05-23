"use client";

import { useEffect } from "react";
import { Features } from "./Features";
import { HeroSection } from "./HeroSection";
import { WaitlistBanner } from "./WaitlistBanner";
import { loadContainer } from "@/utils/AnimationsHandler";

export const Home = ({ data }) => {

  useEffect(() => {
    loadContainer();
  }, []);

  return (
    <>
      <HeroSection data={data} />
      <Features />
      <WaitlistBanner />
    </>
  )
}
