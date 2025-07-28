import { ContainerLoader } from "../ContainerLoader";
import { HeroSection } from "./HeroSection";

export const Home = ({ data }) => {
  const { heroSectionData, stickyMessagesData, homePageData } = data;

  return (
    <>
      <ContainerLoader />
      <HeroSection data={heroSectionData} pageData={homePageData} stickyMessagesData={stickyMessagesData} />
    </>
  )
}
