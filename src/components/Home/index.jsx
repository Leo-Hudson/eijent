import { ContainerLoader } from "../ContainerLoader";
import { Features } from "./Features";
import { HeroSection } from "./HeroSection";
import { WaitlistBanner } from "./WaitlistBanner";

export const Home = ({ data }) => {
  const { heroSectionData, stickyMessagesData, featuresData, homePageData } = data;

  return (
    <>
      <ContainerLoader />
      <HeroSection data={heroSectionData} pageData={homePageData} stickyMessagesData={stickyMessagesData} />
      <Features data={featuresData} pageData={homePageData} />
      <WaitlistBanner data={homePageData} />
    </>
  )
}
