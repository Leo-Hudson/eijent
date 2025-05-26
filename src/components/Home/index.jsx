import { ContainerLoader } from "../ContainerLoader";
import { Features } from "./Features";
import { HeroSection } from "./HeroSection";
import { WaitlistBanner } from "./WaitlistBanner";

export const Home = ({ data }) => {
  const { heroSectionData, stickyMessagesData, homePageData } = data;

  return (
    <>
      {/* <ContainerLoader log={data} /> */}
      <ContainerLoader />
      <HeroSection data={heroSectionData} pageData={homePageData} stickyMessagesData={stickyMessagesData} />
      <Features />
      <WaitlistBanner />
    </>
  )
}
